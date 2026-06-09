---
sidebar_position: 6
---

# Linux Configuration

This page covers Linux-specific configuration for running a Quilibrium node: file descriptor limits, kernel network tuning, and the recommended `systemd` service setup.

For first-time installation, see [Manual Install — Linux](/docs/run-node/node-provisioning/manual-install/linux), which covers downloading the binary and creating the symlinks the service file below depends on.

## File Descriptor Limits (`ulimit -n`)

The node opens a large number of file descriptors during normal operation: one per RocksDB SST file across the hypergraph, clock, key, and token stores; one per libp2p peer connection; one per worker process IPC channel; plus the usual log files and gRPC streams.
The default Linux limit of `1024` open files per process is far below what the node needs and will cause RocksDB open failures, dropped peer connections, and silent stalls under load.

Set the limit to at least `1048576` (1M).
Lower values may work for very small worker counts, but `1M` is the recommended default for any production node.

### Setting the limit system-wide

Edit `/etc/security/limits.conf` and add:

```text
*               soft    nofile          1048576
*               hard    nofile          1048576
root            soft    nofile          1048576
root            hard    nofile          1048576
```

Also ensure PAM applies these limits at login by checking that `/etc/pam.d/common-session` (Debian/Ubuntu) or `/etc/pam.d/login` (RHEL/Fedora) contains:

```text
session required pam_limits.so
```

### Setting the limit for the systemd service

`systemd` services do not inherit `/etc/security/limits.conf` — the limit must be set on the unit itself.
The service file below already includes `LimitNOFILE=1048576`.
If you have an existing service file from an earlier install, add that line under `[Service]`.

You can also set the system-wide systemd default in `/etc/systemd/system.conf`:

```text
DefaultLimitNOFILE=1048576
```

After editing, reboot or run `systemctl daemon-reexec` for the change to take effect.

### Verifying the limit

Once the node is running, confirm the limit is applied to the process:

```bash
cat /proc/$(pgrep -f quilibrium-node | head -1)/limits | grep "Max open files"
```

You should see `1048576` in both the soft and hard columns.

## Kernel Network Tuning

Default Linux network buffer sizes are tuned for a typical desktop and are well below what a node with many peers benefits from.
The following sysctl settings are recommended:

Edit `/etc/sysctl.conf` (or create a file in `/etc/sysctl.d/`, e.g. `/etc/sysctl.d/99-quilibrium.conf`):

```text
# Larger socket buffers — helps libp2p QUIC and TCP throughput
net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.core.rmem_default = 1048576
net.core.wmem_default = 1048576

# UDP buffers — QUIC uses UDP heavily
net.core.netdev_max_backlog = 16384

# More room for many concurrent connections
net.ipv4.tcp_max_syn_backlog = 8192
net.core.somaxconn = 8192
```

Apply without reboot:

```bash
sudo sysctl -p
```

## Running the node as a systemd service

This service file points at the binary directly (no wrapper script), so `systemd` can deliver `SIGINT` for a clean shutdown.
If you installed via the [Manual Install](/docs/run-node/node-provisioning/manual-install/linux) guide, the symlinks the service depends on (`/opt/quilibrium/node/quilibrium-node`) are already in place.

Create the service file:

```bash
sudo nano /lib/systemd/system/quilibrium-node.service
```

Paste:

```ini
[Unit]
Description=Quilibrium Node
StartLimitIntervalSec=0
StartLimitBurst=0

[Service]
Type=simple
Restart=always
RestartSec=5s
WorkingDirectory=/opt/quilibrium/node
ExecStart=/opt/quilibrium/node/quilibrium-node
KillSignal=SIGINT
RestartKillSignal=SIGINT
FinalKillSignal=SIGKILL
TimeoutStopSec=30s
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

:::tip
`LimitNOFILE=1048576` is critical — without it the node will start up but eventually hit RocksDB open failures and disconnect peers as the process grows.
:::

Enable the service so it starts on every reboot:

```bash
sudo systemctl daemon-reload
sudo systemctl enable quilibrium-node
```

Start the node service:

```bash
sudo systemctl start quilibrium-node
```

## Useful node commands

### Service commands

*The commands below assume the systemd service named `quilibrium-node`.
Adjust the name if your installation uses a different one.*

| Action | Command |
|--------|---------|
| Start | `sudo systemctl start quilibrium-node` |
| Stop | `sudo systemctl stop quilibrium-node` |
| Restart | `sudo systemctl restart quilibrium-node` |
| Status | `sudo systemctl status quilibrium-node` |
| Follow logs | `journalctl -u quilibrium-node -f --no-hostname -o cat` |
| Check version in logs | `journalctl -u quilibrium-node -r --no-hostname -n 1 -g "Quilibrium Node" -o cat` |

### General node commands

*Replace `<version>`, `<os>`, and `<arch>` placeholders accordingly (e.g. `node-2.1.0.20-linux-amd64` or `node-2.1.0.20-darwin-arm64`).
If you set up the `quilibrium-node` symlink during install, you can use that name directly.*

Print node peer ID:

```bash
./node-<version>-<os>-<arch> --peer-id
```

Print node info (version, prover address, current frame):

```bash
./node-<version>-<os>-<arch> --node-info
```

Print peer info (the full PeerInfo dump including reachability):

```bash
./node-<version>-<os>-<arch> --peer-info
```

Print Prometheus metrics snapshot:

```bash
./node-<version>-<os>-<arch> --metrics
```

Filter the metrics output by substring:

```bash
./node-<version>-<os>-<arch> --metrics --metrics-filter coverage
```

Enable debug logging (combined with one of the above, or for a running node):

```bash
./node-<version>-<os>-<arch> --debug
```

:::tip
Token operations (balance, transfer, etc.) live in [QClient](/docs/run-node/qclient/qclient-101), not the node binary.
Use `qclient token balance` against your local node or the public RPC.
:::
