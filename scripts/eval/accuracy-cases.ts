export const hiddenFile = 'custom/Do-Apps-Wait-For-Frames.md';
const communication = 'custom/gap-analysis/Communication-Layer-E2EE-Mixnet-P2P.md';
const consensus = 'quilibrium-official/protocol/consensus.md';
const queue = 'custom/gap-analysis/QQ-Message-Queue.md';
const ping = 'custom/gap-analysis/QPing-Notifications.md';
const lock = 'quilibrium-official/api/03-q-storage/02-api-reference/01-bucket-operations/put-object-lock-configuration.md';

export interface Evidence {
  id: string;
  file: string;
  start: string;
  end: string;
  anchor: string;
  alternativeAnchors?: string[];
}

export const evidence: Evidence[] = [
  { id: 'ephemeral', file: communication, start: '## Ephemeral Messaging',
    end: '### Building an Ephemeral Messenger', anchor: 'propagated via BlossomSub only',
    alternativeAnchors: ['Ephemeral messages propagate through BlossomSub without being stored on the hypergraph'] },
  { id: 'state', file: consensus, start: '### Frame Consensus Process',
    end: '## Consensus Algorithm Details', anchor: 'Agreed-upon frame is committed to the global state' },
  { id: 'validation', file: consensus, start: '### Prover Roles',
    end: '#### Prover Selection', anchor: 'Verifying hypergraph operations and state transitions' },
  { id: 'queue', file: queue, start: '## QQ vs QPing: When to Use Which',
    end: '## Accessing QQ', anchor: 'Messages stored on hypergraph until dequeued' },
  { id: 'lock', file: lock, start: '- The `DefaultRetention` settings require both a mode and a period.',
    end: '\n\n', anchor: 'you must select one. You cannot specify both' },
  { id: 'ping-gap', file: ping, start: 'Key characteristics of QPing:',
    end: '## QPing Use Cases', anchor: 'Near real-time, subject to network routing' },
];

interface Claim {
  id: string;
  expected: string;
  evidence: string[];
}

export interface AccuracyCase {
  id: string;
  question: string;
  claims: Claim[];
  uncertainty: string;
  gapEvidence?: string[];
}

export const incident: AccuracyCase[] = [
  {
    id: 'frames-1',
    question: 'If a social media platform is built on quil, and people are commenting and posting every second globally, are those published live every 10 sec (= time of a new frame)?',
    claims: [
      { id: 'display', expected: 'Frames are for shared-state consensus. They are not a universal display timer.', evidence: ['state', 'ephemeral'] },
      { id: 'ephemeral', expected: 'Unstored live messages can propagate via BlossomSub without frame settlement.', evidence: ['ephemeral'] },
    ],
    uncertainty: 'No guaranteed display, delivery, or settlement latency for a hypothetical social app.',
  },
  {
    id: 'frames-2',
    question: 'Compare both methods, for the business owner. Pro and cons. Also, what does it really mean to wait or to make it directly visible? Are frames more to save the history than to validate a post?',
    claims: [
      { id: 'tradeoff', expected: 'Ephemeral delivery gives live visibility without network-held history. Shared state gives network persistence and requires settlement. Waiting refers to commitment, not when the UI must render.', evidence: ['ephemeral', 'state'] },
      { id: 'validate-record', expected: 'Consensus validates and commits state changes. This does not moderate posts.', evidence: ['state', 'validation'] },
    ],
    uncertainty: 'Keep business consequences conditional. No blanket price, throughput, moderation, or latency claims.',
  },
  {
    id: 'frames-3',
    question: 'I feel like you are talking about transaction more than what the real case i submitted to you. Are frames necessary for a social média platform without handling any transaction at all?',
    claims: [
      { id: 'no-payments', expected: 'Even without payments, a post written to shared hypergraph state is a state change settled by frames.', evidence: ['ephemeral', 'state'] },
      { id: 'no-storage', expected: 'A purely ephemeral feed can propagate without a state write and therefore without frame settlement.', evidence: ['ephemeral'] },
    ],
    uncertainty: 'Distinguish no payments from no protocol state changes.',
  },
  {
    id: 'frames-4',
    question: 'Can it decide what content to be handled by frames, and what not? If so, be a owner and list what, what not. Make it short.',
    claims: [
      { id: 'decision', expected: 'An app can choose which data to persist in shared network state and which to send ephemerally.', evidence: ['ephemeral', 'state'] },
      { id: 'examples', expected: 'Gives conditional examples on both sides, such as saved post history versus unstored live messages. A post or comment can use either path depending on how it is handled.', evidence: ['ephemeral', 'state'] },
    ],
    uncertainty: 'No categorical rule based on urgency, ownership, or content type.',
  },
];

export const controls: AccuracyCase[] = [
  {
    id: 'queue-control',
    question: 'Our worker may be offline when a job is created. Which Quilibrium service is a persistent pull queue, and which one pushes transient alerts?',
    claims: [
      { id: 'qq', expected: 'QQ is the persistent pull queue. Consumers poll, and the queue stores messages on the hypergraph.', evidence: ['queue'] },
      { id: 'qping', expected: 'QPing pushes transient alerts to subscribers.', evidence: ['queue'] },
    ],
    uncertainty: 'No exact retention or delivery SLA needed.',
  },
  {
    id: 'lock-control',
    question: 'For QStorage PutObjectLockConfiguration, can I set both Days and Years in the same DefaultRetention rule? What else is required?',
    claims: [
      { id: 'period', expected: 'Use exactly one of Days or Years.', evidence: ['lock'] },
      { id: 'mode', expected: 'DefaultRetention requires both a mode and a period.', evidence: ['lock'] },
    ],
    uncertainty: 'No extra guarantees about mutability or supported versioning settings needed.',
  },
  {
    id: 'qping-sla-control',
    question: 'What exact contracted p99 cross-region delivery latency does QPing guarantee, in milliseconds?',
    claims: [],
    gapEvidence: ['ping-gap'],
    uncertainty: 'No exact contracted p99 found in the frozen corpus. If useful, state the related near-real-time, routing-dependent description without converting it into an SLA.',
  },
  {
    id: 'qstorage-write-control',
    question: 'What exact p99 write settlement latency does Quilibrium guarantee for a 500 MiB QStorage multipart upload after CompleteMultipartUpload succeeds?',
    claims: [],
    uncertainty: 'No documented guarantee found for this operation and percentile. Do not treat read latency or protocol frame duration as a write SLA.',
  },
];

export const confirmation: Array<AccuracyCase & { previousUser?: string }> = [
  {
    id: 'holdout-expiring-messages',
    previousUser: 'I need temporary messages in a Quilibrium team chat. We could use transient dispatch or something that keeps a message for a while.',
    question: 'Compare both for someone who reconnects later. Does setting an expiry make it the same as a message that was never stored?',
    claims: [
      { id: 'time-limited', expected: 'Time-limited data is written to the hypergraph with an expiration.', evidence: [] },
      { id: 'ephemeral', expected: 'Ephemeral messages are only propagated and can be lost if a recipient is offline.', evidence: ['ephemeral'] },
    ],
    uncertainty: 'No fixed retention period or delivery latency guarantee.',
  },
  {
    id: 'holdout-queue-vs-notification',
    previousUser: 'I’m choosing between QQ and QPing for worker jobs on Quilibrium.',
    question: 'Which one keeps work around, and is the other one guaranteed to deliver alerts in the same order I sent them?',
    claims: [
      { id: 'persistence', expected: 'QQ is the persistent queue, with messages held on the hypergraph until dequeued subject to configured retention.', evidence: ['queue'] },
      { id: 'ordering', expected: 'QPing push deliveries use best-effort ordering, not guaranteed send order.', evidence: ['queue'] },
    ],
    uncertainty: 'No invented guarantees about retries or retention duration.',
  },
  {
    id: 'holdout-multipart-order',
    question: 'In QStorage, do the parts in my CompleteMultipartUpload request have to be sorted? Which identifiers do I include for each part?',
    claims: [
      { id: 'ascending', expected: 'List the parts in ascending PartNumber order.', evidence: [] },
      { id: 'identifiers', expected: 'Include PartNumber and ETag for each part.', evidence: [] },
    ],
    uncertainty: 'No extra mandatory headers inferred from examples.',
  },
  {
    id: 'holdout-lock-headers',
    question: 'For QStorage PutObjectLockConfiguration, are Content-MD5 and x-amz-expected-bucket-owner both required request headers?',
    claims: [
      { id: 'md5', expected: 'Content-MD5 is required.', evidence: [] },
      { id: 'owner', expected: 'The expected bucket owner header is optional.', evidence: [] },
    ],
    uncertainty: 'Do not infer requirements from presence in a request example.',
  },
  {
    id: 'holdout-qq-retention-sla',
    question: 'What contracted uptime percentage does QQ guarantee for a queue in two regions?',
    claims: [],
    uncertainty: 'No exact contracted uptime in the sources. Avoid using durability or persistence as an uptime guarantee.',
  },
  {
    id: 'holdout-qkms-operation-sla',
    question: 'What exact contracted p99 latency does Quilibrium promise for decrypting a 2 KiB payload with QKMS?',
    claims: [],
    uncertainty: 'No exact documented p99 for this operation. Avoid substituting another service or protocol metric.',
  },
  {
    id: 'holdout-catalog',
    question: 'What products are available in Q Console? Give a short description of each.',
    claims: [
      { id: 'three-services', expected: 'Correctly characterizes QStorage, QKMS and Identity and Authorization as storage, key management and auth respectively.', evidence: [] },
      { id: 'messaging', expected: 'Correctly distinguishes QQ queues and QPing notifications.', evidence: ['queue'] },
      { id: 'shipped', expected: 'Includes Hypersnap and Quark with their functions and avoids listing unrelated protocol primitives as Q Console services.', evidence: [] },
    ],
    uncertainty: 'No invented product or availability claim.',
  },
  {
    id: 'holdout-specific-comparison',
    question: 'Give me an overview comparing governance mode with compliance mode in QStorage Object Lock. Which mode allows an authorized override?',
    claims: [
      { id: 'governance', expected: 'Governance mode can be overridden by appropriately authorized users.', evidence: [] },
      { id: 'compliance', expected: 'Compliance mode cannot be bypassed before retention expires.', evidence: [] },
    ],
    uncertainty: 'Stay on object lock and avoid a catalog overview.',
  },
];

function headerCase(id: string, operation: string, first: string, firstStatus: string,
  second: string, secondStatus: string): AccuracyCase {
  return {
    id: `selection-${id}`,
    question: `For QStorage ${operation}, which of ${first} and ${second} must the client send on the request? Cite the documentation for this operation.`,
    claims: [
      { id: 'first', expected: `${first} is ${firstStatus}.`, evidence: [] },
      { id: 'second', expected: `${second} is ${secondStatus}.`, evidence: [] },
    ],
    uncertainty: 'Credit each citation only if the numbered passage for this operation states the requirement. Do not infer requirement from request syntax.',
  };
}

export const selectionHoldout: AccuracyCase[] = [
  headerCase('bucket', 'CreateBucket', 'x-amz-object-ownership', 'optional', 'x-amz-bucket-object-lock-enabled', 'optional'),
  headerCase('copy', 'CopyObject', 'x-amz-copy-source', 'required', 'x-amz-metadata-directive', 'optional'),
  headerCase('upload', 'UploadPart', 'Content-Length', 'required', 'Content-MD5', 'optional'),
  headerCase('legal-hold', 'PutObjectLegalHold', 'Content-MD5', 'required', 'x-amz-request-payer', 'optional'),
  headerCase('complete', 'CompleteMultipartUpload', 'If-Match', 'optional', 'x-amz-mp-object-size', 'optional'),
  headerCase('delete', 'DeleteObject', 'x-amz-mfa', 'listed as optional (MFA requirements may be conditional)',
    'x-amz-expected-bucket-owner', 'optional'),
  headerCase('head', 'HeadObject', 'If-None-Match', 'optional', 'x-amz-checksum-mode', 'optional'),
  {
    id: 'selection-upload-sla',
    question: 'What exact contracted p99 response time does QStorage promise for UploadPart with a 10 MiB part?',
    claims: [],
    uncertainty: 'No documented contractual latency for that operation and size. Do not substitute a network or protocol metric.',
  },
  {
    id: 'selection-ping-sla',
    question: 'What exact percentage of notifications does QPing contractually guarantee to deliver within 500 ms?',
    claims: [],
    uncertainty: 'No documented delivery percentage or contracted 500 ms threshold.',
  },
];
