

export interface IAppMetaData {
  name: string;
  displayName?: string;
  version: string;
  repository: string;
  description: string;
  homepage: string;
  screenshot?: string;
}

let metaData: Promise<IAppMetaData> | undefined = undefined;

export default function getMetaData() {
  if (metaData === undefined) {
    metaData = self.fetch('./phoveaMetaData.json').then((r) => r.json()).catch((_r) => {
      console.warn('cannot read phoveaMetaData.json file, generate dummy');
      return {name: 'Phovea Application', version: '?', repository: '?', homepage: '', description: 'Fallback appication meta data'};
    });
  }
  return metaData;
}
