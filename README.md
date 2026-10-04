# Private Network Service Platform
## Computer Networks — Phase 1

A team-based local networking project demonstrating DNS, TCP/IP, HTTP, HTTPS/TLS, reverse proxying, load balancing, HTTP caching, packet analysis, and backend failure handling in a private LAN environment.

---

## Team Members

| Name | Role | IP Address | Services |
|---|---|---|---|
| Vani Rudra | DNS + Backend A | 10.7.6.20 | dnsmasq, Backend A |
| Apoorva Choudhary | Nginx + HTTPS + Load Balancer | 10.7.3.37 | Nginx, HTTPS, Load Balancer |
| Vidhi | Backend B | 10.7.3.188 | Backend B |

---

## Network Configuration

| Parameter | Value |
|---|---|
| Network | 10.7.0.0/19 |
| Subnet Mask | 255.255.224.0 |
| Default Gateway | 10.7.0.1 |
| DNS Server | 10.7.6.20 |

---

## Project Architecture

```text
                         Private LAN
                        10.7.0.0/19
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
      Mac 1              Mac 2              Mac 3
      Vani              Apoorva              Vidhi
   10.7.6.20          10.7.3.37          10.7.3.188
          |                  |                  |
       DNS :53          Nginx :8443        Backend B
     Backend A           HTTPS/LB            :3002
       :3001
          |                  |
          +--------+---------+
                   |
             Backend A / B

Project Overview
The project consists of three macOS laptops connected to the same private LAN.
Each machine has a specific role:
- Mac 1 provides private DNS using dnsmasq and hosts Backend A.
- Mac 2 acts as the edge server using Nginx, HTTPS, reverse proxying, and load balancing.
- Mac 3 hosts Backend B.
- All three machines communicate using private IPv4 addresses.
The complete system demonstrates how a client request travels through DNS resolution, TCP connectivity, TLS-secured HTTPS, Nginx reverse proxying, load balancing, backend processing, and response delivery.
Project Components
Mac 1 — DNS + Backend A
Team Member: Vani Rudra
IP Address: 10.7.6.20
Services:
dnsmasq    → Port 53
Backend A  → Port 3001

Responsibilities:
- Private DNS server
- Backend A
- DNS resolution for the project domains
- Client-side testing
Mac 2 — Nginx + HTTPS + Load Balancer
Team Member: Apoorva Choudhary
IP Address: 10.7.3.37
Services:
Nginx HTTP  → Port 8080
Nginx HTTPS → Port 8443

Responsibilities:
- Single public entry point
- HTTPS termination
- Reverse proxy
- Load balancing
- Forwarding requests to Backend A and Backend B
Mac 3 — Backend B
Team Member: Vidhi
IP Address: 10.7.3.188
Service:
Backend B → Port 3002

Responsibilities:
- Backend B
- Processing requests forwarded by Nginx
- Providing a second backend for load balancing and failure testing
Request Flow
The complete request flow is:
                         Client
                            |
                            | DNS Query
                            v
                    Mac 1 — dnsmasq
                       10.7.6.20
                            |
                            | app.teambyte.test
                            |       ↓
                            |   10.7.3.37
                            v
                    Mac 2 — Nginx
                    10.7.3.37:8443
                            |
                       HTTPS / TLS
                            |
                     Load Balancing
                       /          \
                      /            \
                     v              v
             Backend A          Backend B
          10.7.6.20:3001    10.7.3.188:3002

Backend A
Backend A runs on Mac 1.
Host    : 10.7.6.20
Port    : 3001
Backend : A

Backend A is implemented using Node.js and Express.
It identifies itself using the following response header:
X-Backend: A

Backend A Endpoints
GET /
GET /api/status

How to Run Backend A
Navigate to the Backend A directory:
cd backend-a

Install dependencies:
npm install

Start the backend:
npm start

Backend A will run on:
http://10.7.6.20:3001

Test Backend A
Run:
curl -i http://10.7.6.20:3001/api/status

Expected response:
HTTP/1.1 200 OK
X-Backend: A
Cache-Control: max-age=60

Expected response body:
{
  "backend": "A",
  "status": "ok"
}

Backend B
Backend B runs on Mac 3.
Host    : 10.7.3.188
Port    : 3002
Backend : B

Backend B is implemented using Node.js and Express.
It identifies itself using:
X-Backend: B

Backend B Endpoints
GET /
GET /api/status

How to Run Backend B
Navigate to the Backend B directory:
cd backend-b

Install dependencies:
npm install

Start the backend:
npm start

Backend B will run on:
http://10.7.3.188:3002

Test Backend B
Run:
curl -i http://10.7.3.188:3002/api/status

Expected response:
HTTP/1.1 200 OK
X-Backend: B
Cache-Control: max-age=60

Expected response body:
{
  "backend": "B",
  "status": "ok"
}

Private DNS
Mac 1 runs dnsmasq as the private DNS server.
The following domains are configured:
app.teambyte.test → 10.7.3.37
api.teambyte.test → 10.7.3.37

Both domains resolve to Mac 2, where Nginx is running.
Mac 2 and Mac 3 use Mac 1 as their DNS server:
DNS Server: 10.7.6.20

dnsmasq Configuration
The relevant dnsmasq configuration is:
address=/app.teambyte.test/10.7.3.37
address=/api.teambyte.test/10.7.3.37

listen-address=127.0.0.1,10.7.6.20

Test DNS Resolution
Run:
dig app.teambyte.test

Expected result:
status: NOERROR

ANSWER SECTION:
app.teambyte.test.    0    IN    A    10.7.3.37

SERVER: 10.7.6.20#53

This confirms that the private DNS server resolves the application domain to the Nginx machine.
Nginx Reverse Proxy
Mac 2 acts as the edge server.
Nginx provides:
- Single public entry point
- Reverse proxy
- HTTPS termination
- Load balancing
- Backend forwarding
The backend servers are:
Backend A → 10.7.6.20:3001
Backend B → 10.7.3.188:3002

Nginx Ports
HTTP  → 8080
HTTPS → 8443

Nginx Upstream Configuration
The load-balanced backend group is configured as:
upstream backends {
    server 10.7.6.20:3001;
    server 10.7.3.188:3002;
}

Nginx forwards incoming requests to the configured backend servers.
HTTPS / TLS
The project uses HTTPS with TLS 1.3.
The HTTPS service runs on:
Port: 8443

The certificate contains the following Subject Alternative Names:
app.teambyte.test
api.teambyte.test

The certificate was trusted on the client machines.
Therefore, the final HTTPS demonstration can be performed without using the -k option.
HTTPS Test
Run:
curl -i https://app.teambyte.test:8443/api/status

Expected response:
HTTP/1.1 200 OK

The response can contain:
X-Backend: A

or:
X-Backend: B

depending on which backend handles the request.
TLS Handshake
The TLS 1.3 handshake was verified using verbose curl output and packet capture.
The observed handshake includes:
ClientHello
ServerHello
Certificate
Certificate Verify
Finished
Finished

After the TLS handshake, encrypted application data is exchanged.
Load Balancing
Nginx distributes incoming requests between Backend A and Backend B.
The backend that handles a request is identified using the:
X-Backend

response header.
Example:
Request 1  → X-Backend: A
Request 2  → X-Backend: B
Request 3  → X-Backend: A
Request 4  → X-Backend: B
Request 5  → X-Backend: A
Request 6  → X-Backend: B
Request 7  → X-Backend: A
Request 8  → X-Backend: B
Request 9  → X-Backend: A
Request 10 → X-Backend: B

This demonstrates round-robin distribution between the two backend servers.
Load Balancing Test
Run:
for i in {1..10}; do
  curl -s -D - https://app.teambyte.test:8443/api/status \
  -o /dev/null | grep X-Backend
done

Expected output:
X-Backend: A
X-Backend: B
X-Backend: A
X-Backend: B
X-Backend: A
X-Backend: B
X-Backend: A
X-Backend: B
X-Backend: A
X-Backend: B

HTTP Caching
The /api/status endpoint supports HTTP caching.
The response contains:
Cache-Control: max-age=60

Express also generates an ETag for the response.
Example:
ETag: W/"1d-/mMMZex8nvIDi44lSUobi0vFg/M"

A conditional request containing the matching ETag can return:
HTTP/1.1 304 Not Modified

This demonstrates HTTP conditional caching and allows an unchanged response to avoid retransmitting the response body.
Network Connectivity Testing
The three machines were tested using pairwise ping.
Mac 1 → Mac 2
ping 10.7.3.37

Result:
4 packets transmitted
4 packets received
0% packet loss

Mac 1 → Mac 3
ping 10.7.3.188

Result:
4 packets transmitted
4 packets received
0% packet loss

Mac 2 → Mac 3
ping 10.7.3.188

Result:
4 packets transmitted
4 packets received
0% packet loss

Packet Analysis
Wireshark was used to inspect the network traffic generated by the project.
The following traffic was captured and analyzed:
- DNS query and response
- TCP three-way handshake
- TLS 1.3 handshake
- Encrypted application data
- HTTP response headers
- Load-balanced backend responses
DNS Packet Flow
The DNS query is sent from the client to Mac 1:
Mac 2 → Mac 1
DNS Query: app.teambyte.test

Mac 1 sends the DNS response:
Mac 1 → Mac 2
DNS Response: 10.7.3.37

TCP Three-Way Handshake
The TCP connection is established using:
SYN
  ↓
SYN-ACK
  ↓
ACK

TLS Traffic
The TLS 1.3 handshake includes:
ClientHello
ServerHello
Certificate
Certificate Verify
Finished

After the handshake, encrypted application data is exchanged.
Backend Failure Demonstration
The project demonstrates service continuity when one backend becomes unavailable.
Backend B is deliberately stopped during the failure demonstration.
Direct Backend B Request
When Backend B is stopped:
Client
   |
   v
Backend B :3002
   |
   X
Service unavailable

A direct request to Backend B fails because the service is no longer running.
Request Through Nginx
However, when the request is sent through the Nginx load balancer:
Client
   |
   v
Nginx :8443
   |
   +------ Backend A → Available
   |
   +------ Backend B → Down

The service continues through the healthy Backend A.
This demonstrates service continuity even when one backend becomes unavailable.
Complete End-to-End Test
After DNS, both backends, and Nginx are running, the complete service can be tested using:
curl -i https://app.teambyte.test:8443/api/status

The complete request flow is:
1. Client requests app.teambyte.test
                ↓
2. DNS query is sent to 10.7.6.20
                ↓
3. dnsmasq resolves app.teambyte.test
                ↓
4. Domain resolves to 10.7.3.37
                ↓
5. Client connects to Nginx on port 8443
                ↓
6. TLS 1.3 handshake takes place
                ↓
7. Nginx forwards the request to a backend
                ↓
8. Backend A or Backend B processes the request
                ↓
9. Response is returned through Nginx
                ↓
10. Client receives HTTP 200 response

Useful Testing Commands
Check LAN Connectivity
ping 10.7.6.20
ping 10.7.3.37
ping 10.7.3.188

Check DNS
dig app.teambyte.test

Test Backend A Directly
curl -i http://10.7.6.20:3001/api/status

Test Backend B Directly
curl -i http://10.7.3.188:3002/api/status

Test HTTPS Through Nginx
curl -i https://app.teambyte.test:8443/api/status

Test TLS Details
curl -v https://app.teambyte.test:8443/api/status

Test Multiple Load-Balanced Requests
for i in {1..10}; do
  curl -s -D - https://app.teambyte.test:8443/api/status \
  -o /dev/null | grep X-Backend
done

Repository Structure
computer-networks-phase1/
│
├── README.md
│
├── backend-a/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── backend-b/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── nginx/
│   └── nginx.conf
│
├── dns/
│   └── dnsmasq.conf
│
├── tls/
│   └── README.md
│
└── evidence/
    └── README.md

Technologies Used
- macOS
- Node.js
- Express.js
- Nginx
- dnsmasq
- HTTPS / TLS 1.3
- Wireshark
- curl
- dig
- TCP/IP
- Private IPv4 networking
Phase 1 Verification
The Phase 1 implementation verifies:
- [x] All three machines connected to the same private LAN
- [x] Private IPv4 addressing
- [x] Pairwise connectivity
- [x] Private DNS using dnsmasq
- [x] Domain resolution through Mac 1
- [x] Backend A
- [x] Backend B
- [x] Nginx reverse proxy
- [x] HTTPS / TLS 1.3
- [x] Trusted certificate
- [x] Round-robin load balancing
- [x] HTTP caching
- [x] ETag / 304 Not Modified
- [x] Wireshark packet analysis
- [x] Backend failure demonstration
- [x] Service continuity through the available backend
Project Objective
The objective of this project is to demonstrate how multiple computer networking concepts work together in a real private LAN environment.
The project connects:
DNS
 ↓
TCP/IP
 ↓
HTTPS / TLS
 ↓
HTTP
 ↓
Reverse Proxy
 ↓
Load Balancing
 ↓
Caching
 ↓
Packet Analysis
 ↓
Failure Handling