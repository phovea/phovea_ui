

export interface IAppMetaData {
  name: string;
  version: string;
  repository: string;
  description: string;
  screenshot?: string;
}

let metaData: Promise<IAppMetaData> = null;

export default function getMetaData() {
  if (metaData === null) {
    metaData = self.fetch('./phoveaMetaData.json').then((r) => r.json()).catch((r) => {
      console.warn('cannot read phoveaMetaData.json file, generate dummy');
      return { name: 'Phovea Application', version: '?', repository: '?', description: 'Fallback appication meta data'};
    });
  }
  return metaData;
}
