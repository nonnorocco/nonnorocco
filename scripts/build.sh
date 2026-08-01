#!/bin/bash
set -e

hugo --gc --minify

cat > public/_headers <<EOF
/*
  Basic-Auth: family $FAMILY_ARCHIVE_PASSWORD
EOF

echo "=== CHECKING HEADERS FILE ==="
cat public/_headers
echo "=============================="