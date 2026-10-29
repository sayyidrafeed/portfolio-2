#!/bin/sh
# robots.txt and sitemap.xml carry the build-time origin. When the container sets SITE_URL
# (for example in Dokploy), swap that origin for the runtime one before Nginx starts.
set -eu

[ -n "${SITE_URL:-}" ] || exit 0

build_origin=$(cat /etc/nginx/build-site-url)
target_origin=$(printf '%s' "$SITE_URL" | sed -E 's#^(https?://[^/]+).*$#\1#')

case "$target_origin" in
  http://* | https://*) ;;
  *)
    echo "SITE_URL must start with http:// or https://, got: $SITE_URL" >&2
    exit 1
    ;;
esac

[ "$build_origin" = "$target_origin" ] && exit 0

for file in /usr/share/nginx/html/robots.txt /usr/share/nginx/html/sitemap.xml; do
  sed -i "s#${build_origin}#${target_origin}#g" "$file"
done

echo "SITE_URL: robots.txt and sitemap.xml now point at ${target_origin}"
