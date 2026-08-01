#!/bin/bash
set -e

hugo --gc --minify

cat > public/_headers <<EOF
/*
  Basic-Auth: family $PASSWORD
EOF

echo "=== CHECKING HEADERS FILE ==="
cat public/_headers
echo "=============================="