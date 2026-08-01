#!/bin/bash
set -e

mkdir -p public

cat > public/_headers <<EOF
/*
  Basic-Auth: family $FAMILY_ARCHIVE_PASSWORD
EOF

hugo --gc --minify