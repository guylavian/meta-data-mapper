export interface MetadataUrl {
  name: string;
  url: string;
  description: string;
  type: 'json' | 'xml' | 'yaml';
}

export const metadataUrls: MetadataUrl[] = [
  {
    name: 'Pokemon API',
    url: 'https://pokeapi.co/api/v2/pokemon/1',
    description: 'Pokemon data in JSON format',
    type: 'json'
  },
  {
    name: 'Star Wars API',
    url: 'https://swapi.dev/api/people/1',
    description: 'Star Wars character data in JSON format',
    type: 'json'
  },
  {
    name: 'Countries API',
    url: 'https://restcountries.com/v3.1/name/usa',
    description: 'Country information in JSON format',
    type: 'json'
  },
  {
    name: 'Weather API',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY',
    description: 'Weather data in JSON format (requires API key)',
    type: 'json'
  },
  {
    name: 'GitHub API',
    url: 'https://api.github.com/users/octocat',
    description: 'GitHub user data in JSON format',
    type: 'json'
  }
]; 