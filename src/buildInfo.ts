/**
 * Created by Samuel Gratzl on 21.11.2016.
 */

import {getAPIJSON} from 'phovea_core/src/ajax';
import {offline} from 'phovea_core/src';
import i18next from 'phovea_core/src/i18n';

interface IBuildInfo {
  name: string;
  version: string;
  resolved: string;
}

interface IServerBuildInfo extends IBuildInfo {
  dependencies: string[];
  plugins: IBuildInfo[];
}

interface IClientBuildInfo extends IBuildInfo {
  dependencies: any;
  extraDependencies: any;
}

export class BuildInfo {
  constructor(private client: IClientBuildInfo, private server?: IServerBuildInfo) {

  }

  toString() {
    return 'BuildInfo';
  }

  private buildBuildInfo() {
    const build = this.client;
    return `<table class="table table-bordered table-condensed">
            <tbody>
              <tr><th>${i18next.t('phovea:ui.application')}</th><td>${build.name}</td></tr>
              <tr><th>${i18next.t('phovea:ui.version')}</th><td>${build.version}</td></tr>
              ${this.server ? `<tr><th>Server</th><td>${this.server.version}</td></tr>` : ''}
              <tr><th>${i18next.t('phovea:ui.url')}</th><td><code>${location.pathname}${location.hash}</code></td></tr>
              <tr><th>${i18next.t('phovea:ui.userAgent')}</th><td>${navigator.userAgent}</td></tr>
              <tr><th>${i18next.t('phovea:ui.github')}</th><td><a href="${build.resolved.replace(/(\.git|\/commit\/).*/, '/issues/new')}" target="_blank">${i18next.t('phovea:ui.submitIssue')}</a></td></tr>
            </tbody>
            </table>`;
  }

  private buildIssuesContent() {
    // don't use location.href, since I don't wanna expose server names
    return `
    ${i18next.t('phovea:ui.issueHeader')}
    ${i18next.t('phovea:ui.separator')}
    ${i18next.t('phovea:ui.applicationRow', {name: this.client.name})}
    ${i18next.t('phovea:ui.versionRow', {version: this.client.version, resolved: this.client.resolved})}${this.server ? i18next.t('phovea:ui.serverRow', {version: this.server.version, resolved: this.server.resolved}) : ''}
    ${i18next.t('phovea:ui.urlRow', {pathname: location.pathname, hash: location.hash})}
    ${i18next.t('phovea:ui.userAgentRow', {userAgent: navigator.userAgent})}
    ${i18next.t('phovea:ui.platformRow', {platform: navigator.platform})}
    ${i18next.t('phovea:ui.ScreenSizeRow', {width: screen.width, height: screen.height})}
    ${i18next.t('phovea:ui.WindowSizeRow', {innerWidth: window.innerWidth, innerHeight: window.innerHeight})}

~~~json\n${JSON.stringify(this.client, null, ' ')}\n${this.server ? `\n${JSON.stringify(this.server, null, ' ')}\n` : ''}~~~`;
  }

  toHTML() {
    return `
      <h4>${i18next.t('phovea:ui.buildInfo')}</h4>
      ${this.buildBuildInfo()}
      <h4>${i18next.t('phovea:ui.buildDetails')}</h4>
      <textarea readonly="readonly">${this.buildIssuesContent()}</textarea>
    `;
  }
}

export default function build(): Promise<BuildInfo> {
  const buildInfos = Promise.all([
    (<any>self).fetch('./buildInfo.json').then((response) => response.json()),
    offline ? null : getAPIJSON('/buildInfo.json')
  ]);
  return buildInfos.then((args: any[]) => new BuildInfo(args[0], args[1]));
}
