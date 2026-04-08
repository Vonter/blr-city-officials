import * as gmapsLoader from '@googlemaps/js-api-loader';

const { Loader } = gmapsLoader;

let loader: InstanceType<typeof Loader> | null = null;

export function getLoader(apiKey: string) {
  if (!loader) {
    loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geocoding']
    });
  }
  return loader;
}
