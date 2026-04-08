export function getBaseUrl(request: Request, url: URL): string {
  const host = request.headers.get('host') || url.host;
  const protocol = process.env['NODE_ENV'] === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
}
