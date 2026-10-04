# HTTPS / TLS Configuration

## Overview

The project uses HTTPS with **TLS 1.3** to secure communication between clients and the Nginx edge server.

Nginx runs the HTTPS service on:

```text
Port: 8443
```

The HTTPS service is available through the private application domains:

```text
app.teambyte.test
api.teambyte.test
```

---

## TLS Certificate

The certificate was configured for the project domains using **Subject Alternative Names (SANs)**.

The certificate includes:

```text
app.teambyte.test
api.teambyte.test
```

This allows the certificate to match the hostname used by the client when connecting through HTTPS.

The certificate was trusted on the client machines.

Therefore, the final HTTPS demonstration can be performed without using the `-k` option with `curl`.

---

## Nginx TLS Configuration

Nginx is configured to listen for HTTPS traffic on port `8443`.

The relevant configuration is:

```nginx
server {
    listen 8443 ssl;

    server_name app.teambyte.test api.teambyte.test;

    ssl_certificate /opt/homebrew/etc/nginx/certs/teambyte.crt;
    ssl_certificate_key /opt/homebrew/etc/nginx/certs/teambyte.key;

    location / {
        proxy_pass http://backends;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The private key and certificate files are **not included in this repository**.

---

## HTTPS Test

The HTTPS service can be tested using:

```bash
curl -i https://app.teambyte.test:8443/api/status
```

Expected response:

```text
HTTP/1.1 200 OK
```

The response can contain:

```text
X-Backend: A
```

or:

```text
X-Backend: B
```

depending on which backend handles the request.

---

## TLS Verification

TLS details can be inspected using verbose `curl`:

```bash
curl -v https://app.teambyte.test:8443/api/status
```

The connection was verified using TLS 1.3.

The observed handshake includes:

```text
ClientHello
ServerHello
Certificate
Certificate Verify
Finished
Finished
```

After the TLS handshake, encrypted application data is exchanged.

---

## TLS Handshake Flow

The basic TLS 1.3 communication flow is:

```text
Client
   |
   | ClientHello
   v
Nginx / Server
   |
   | ServerHello
   | Certificate
   | Certificate Verify
   | Finished
   v
Client
   |
   | Finished
   v
Encrypted Application Data
```

The handshake establishes a secure connection before application data is exchanged.

---

## Certificate Verification

The certificate was trusted on the client machines.

When accessing:

```text
https://app.teambyte.test:8443
```

the hostname matches the certificate SAN:

```text
app.teambyte.test
```

Similarly:

```text
https://api.teambyte.test:8443
```

matches:

```text
api.teambyte.test
```

Because the certificate is trusted by the clients, the final demonstration does not require:

```text
-k
```

---

## TLS and HTTP Request Flow

The complete HTTPS request flow is:

```text
Client
   |
   | DNS Query
   v
Mac 1 — dnsmasq
   |
   | app.teambyte.test → 10.7.3.37
   v
Mac 2 — Nginx
   |
   | TCP Connection
   v
TLS 1.3 Handshake
   |
   | Secure HTTPS Connection
   v
Nginx Reverse Proxy
   |
   | Load Balancing
   +------------------+
   |                  |
   v                  v
Backend A          Backend B
:3001              :3002
```

---

## TLS Packet Analysis

TLS traffic was also inspected using Wireshark.

The captured traffic shows:

- TCP three-way handshake
- TLS ClientHello
- TLS ServerHello
- Certificate
- Certificate Verify
- Finished
- Encrypted application data

After the TLS handshake, the application data is encrypted and cannot be read directly as plaintext HTTP content from the packet capture.

---

## Security Notes

The certificate and private key are intentionally kept outside the GitHub repository.

The repository contains only the TLS configuration and documentation required to understand and reproduce the setup.

The private key must never be committed to a public repository.
