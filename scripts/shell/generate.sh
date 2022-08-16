#!/bin/bash

CERTS_DOMAIN="${CERTS_DOMAIN:-gobletqa.app}"
CERTS_OUT_DIR="${CERTS_OUT_DIR:-certs}"
[ "$1" ] && PASS="$1" || PASS=telbog-60Bl3T

config_cleanup(){
  [ -f "config.cnf" ] && rm -rf config.cnf
  [ -f "extfile-server.cnf" ] && rm -rf extfile-server.cnf
  [ -f "extfile-client.cnf" ] && rm -rf extfile-client.cnf
}

config_create(){
CONFIG=$(cat <<'CONFIG'
[req]
req_extensions = v3_req
distinguished_name = req_distinguished_name
prompt = no
[req_distinguished_name]
C=US
ST=Arizona
L=Tucson
O=GobletQA
OU=GobletQA
CN=*.*.gobletqa.app

[v3_req]
basicConstraints = CA:FALSE
keyUsage=digitalSignature,nonRepudiation,keyEncipherment,dataEncipherment,keyAgreement,keyCertSign
subjectAltName = @alt_names
extendedKeyUsage=serverAuth,clientAuth

[alt_names]
DNS.1 = *.*.gobletqa.app
DNS.2 = *.*.local.gobletqa.app
DNS.3 = *.*.conductor.local.gobletqa.app
DNS.4 = goblet-dind
DNS.5 = docker.internal
DNS.6 = host.docker.internal
DNS.7 = gobletqa.app
DNS.8 = local.gobletqa.app
DNS.9 = conductor.local.gobletqa.app
IP.1 = 127.0.0.1
IP.2 = 192.168.0.1
CONFIG
)

echo "$CONFIG" > config.cnf
}

config_cleanup
config_create
rm -rf ./$CERTS_OUT_DIR
mkdir -p $CERTS_OUT_DIR

# Create private pem
openssl genrsa -aes256 -passout pass:$PASS -out $CERTS_OUT_DIR/ca-private.pem 4096
# Create public pem
openssl req -new -x509 -days 3650 -key $CERTS_OUT_DIR/ca-private.pem -sha256 -passin pass:$PASS -out $CERTS_OUT_DIR/ca-public.pem -nodes -config config.cnf

# Generate the server key
openssl genrsa -out $CERTS_OUT_DIR/server-key.pem 4096
# Generate a certificate signing request
openssl req -config config.cnf -sha256 -new -key $CERTS_OUT_DIR/server-key.pem -out $CERTS_OUT_DIR/request.csr

[ -f "extfile-server.cnf" ] && rm -rf extfile-server.cnf
# Generating a Signed Certificate
echo "subjectAltName=DNS:*.*.$CERTS_DOMAIN;DNS:*.*.local.$CERTS_DOMAIN;DNS:*.*.conductor.local.$CERTS_DOMAIN;DNS:goblet-dind;DNS:docker.internal;DNS:host.docker.internal;DNS:$CERTS_DOMAIN;DNS:local.$CERTS_DOMAIN;DNS:conductor.local.$CERTS_DOMAIN;IP:127.0.0.1;IP:192.168.0.1" >> extfile-server.cnf
echo "extendedKeyUsage=serverAuth,clientAuth" >> extfile-server.cnf

openssl x509 -req -days 3650 -sha256 -in $CERTS_OUT_DIR/request.csr -CA $CERTS_OUT_DIR/ca-public.pem -CAkey $CERTS_OUT_DIR/ca-private.pem -CAcreateserial -extfile extfile-server.cnf -passin pass:$PASS -out $CERTS_OUT_DIR/certificate.pem

# Generating a Client Certificate
# Generate a client key
openssl genrsa -out $CERTS_OUT_DIR/client-key.pem 4096

# Create a certificate signing request
openssl req -config config.cnf -new -key $CERTS_OUT_DIR/client-key.pem -out $CERTS_OUT_DIR/client-request.csr

[ -f "extfile-client.cnf" ] && rm -rf extfile-client.cnf
# Complete the signing
echo "extendedKeyUsage=clientAuth" >> extfile-client.cnf
openssl x509 -req -days 365 -sha256 -in $CERTS_OUT_DIR/client-request.csr -CA $CERTS_OUT_DIR/ca-public.pem -CAkey $CERTS_OUT_DIR/ca-private.pem -CAcreateserial -extfile extfile-client.cnf -passin pass:$PASS -out $CERTS_OUT_DIR/client-certificate.pem

# Clean up after
config_cleanup

# Add the newly generated secrets to kubernetes for server and client client
# yarn kube secret --name docker-server --files ca-public:certs/ca-public.pem,certificate:certs/certificate.pem,server-key:certs/server-key.pem

# yarn kube secret --name docker-client --files ca-public:certs/ca-public.pem,client-certificate:certs/client-certificate.pem,client-key:certs/client-key.pem
