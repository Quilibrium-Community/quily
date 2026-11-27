---
title: "Coppice Client: Post-Quantum End-to-End Encrypted Messaging SDK"
source: github
source_url: https://github.com/QuilibriumNetwork/coppice-client/tree/af46f04547471926586cda20706bb0f470243fc6
date: 2026-11-27
type: technical_reference
topics:
  - Coppice
  - Coppice Client
  - Coppice research
  - Quorum migration
  - post-quantum E2EE
  - direct and group messaging
  - device enrollment
  - recoverable sends
  - browser WebAssembly
---

# Coppice Client

Coppice Client is a public Rust SDK for post-quantum end-to-end encrypted direct and group messaging. Applications can use it with their own account namespace, delivery infrastructure and message formats. It packages a pinned Coppice research engine with account and device management, durable message retries, protected storage, native bindings and a browser worker build. As of November 27, 2026, the SDK and integration tests are public and the coordinated migration of production Quorum apps is still pending. The underlying protocol composition is experimental.

## Coppice Client, Coppice Research and Quorum

Coppice Research explores the group encryption protocol. The client workspace carries a pinned copy of that engine with documented integration changes. Its root Rust crate re-exports the engine and adds identity, account, audience, enrollment, records and mobile storage modules. The pinned engine manifest records original file hashes, and the workspace lockfile governs SDK builds.

Quorum is a host application. Its message events, wallets, profiles, moderation and UI sit outside the reusable SDK. Posts, reactions and edits travel as application-defined bytes, and the host interprets them and enforces product permissions. Quorum's separate delivery backend handles ciphertext replication and forwards sealed requests to member-held owner endpoints. Other hosts supply their own discovery, private enrollment coordination, transport and consent policy.

## Coppice account identity, devices and recovery

Coppice derives a stable Falcon account root from a validated BIP39 seed and a permanent application namespace. Each device generates a fresh credential. Signed root statements carry the application, deployment, full authorized-device list, revision and prior digest. Existing devices pin and persist consecutive revisions. A server that accepts signed application requests also has to check the current authorization and durably consume replay nonces.

Seed recovery restores the account root and can recover the conversation list through the recovery directory where configured. Resuming conversations requires a freshly authorized device, enrollment, and explicit grants for any retained history. Prior sender state, receiving keys and owner authority stay tied to their original protected state. Recovering the account seed alone cannot recreate them. [Conversation recovery](https://github.com/QuilibriumNetwork/coppice-client/blob/af46f04547471926586cda20706bb0f470243fc6/docs/native-sdk.md#recover-the-conversation-list-from-the-account-seed)

## Membership, private introductions and history

Coppice supports owner-managed groups, direct conversations fixed to two distinct account roots, and one-account synchronization across authorized devices. Fixed-account checks bind devices to their exact join offers and verify the complete encryption-era roster against current account authorizations. Managed groups default to fresh owner confirmation for new sends. A host can enable asynchronous sends against verified owner-signed checkpoints published through delivery, with the trade-off that delivery can delay the first observation of a removal.

Private first contact uses a recipient device's signed one-use NTRU offer, with application-supplied routing and consent. Group bootstrap authenticates the intended owner and recipient, then a separate enrollment process provisions receiving material before admission. History sharing is a separate, explicit grant to a recipient for a range of authenticated membership eras. Archived history and already decrypted application records have their own retention implications.

## Coppice send retries and message reads

The application saves an immutable draft with a positive sequence number unique to its device and group before submission. After an interrupted upload or uncertain result, retry the same sequence and bytes. Coppice reuses the committed message ID and ciphertext, and a different draft at that sequence is a conflict. Once resolved sends are retired, their sequences stay spent. A recorded upload acknowledgment establishes server acceptance. Peer delivery and read receipts are separate events.

The sender's canonical local history entry is committed alongside the ciphertext and outbox. The SDK exposes bounded reads with durable cursors so a host can save its encrypted message projection and cursor together. Applications resolve author identity through verified device bindings before showing a sender or applying permissions.

## Coppice native and browser support

The native `coppice-mobile` library exposes a C ABI with Swift and Kotlin/JNI bindings for protected accounts, conversation endpoints, owners and bootstrap. Calls block and belong off the UI thread. Native integrations use encrypted SQLite state and independent key storage through Apple's Keychain or Android's Keystore-backed provider. Android requires API level 28 or newer. Host apps supply a scheduler and handle protected storage being unavailable while a device is locked. [Native SDK and platform integration](https://github.com/QuilibriumNetwork/coppice-client/blob/af46f04547471926586cda20706bb0f470243fc6/docs/native-sdk.md#platform-integration)

The full browser client runs the SDK in a dedicated WebAssembly worker. It uses origin-private files for SQLite and a vault wrapped by a non-extractable WebCrypto key stored in IndexedDB. One tab owns the store at a time. The repository also includes a smaller verifier for public statements, child-group bindings and group documents. The full client has reported Chromium and Node test results. Firefox, Safari and Electron qualification remain open.

## Coppice security and Quorum deployment status

Coppice uses NTRU-HPS-2048-677, Falcon-padded-512, SHAKE256 and ChaCha20-Poly1305. The research wire format and complete protocol composition lack a published audit or security proof in this source snapshot. End-to-end content encryption also leaves transport anonymity as a separate deployment concern. Browser storage has a different trust boundary from native keystores. Code running in the origin can use the browser key, and restoring the entire origin storage together can evade rollback detection. [Browser security differences](https://github.com/QuilibriumNetwork/coppice-client/blob/af46f04547471926586cda20706bb0f470243fc6/docs/browser-sdk.md#security-differences-from-the-native-apps)

The November 27 upstream verification report records native/browser interoperability, exact retry after tab-leader loss, paged history and owner hosting through a relay while a page is open. The report describes local testing, with production cutover, device and deployment qualification, and browser owner availability after all pages close still open. The public client repository alone provides no evidence that production Quorum traffic or Quilibrium mainnet uses Coppice. [Verification record](https://github.com/QuilibriumNetwork/coppice-client/blob/af46f04547471926586cda20706bb0f470243fc6/docs/verification.md)

*Last updated: 2026-11-27*
