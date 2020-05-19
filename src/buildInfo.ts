/**
 * Created by Samuel Gratzl on 21.11.2016.
 */

import {getAPIJSON} from 'phovea_core/src/ajax';
import {offline} from 'phovea_core/src';
import i18n from 'phovea_core/src/i18n';

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
              <tr><th>${i18n.t('phovea:ui.application')}</th><td>${build.name}</td></tr>
              <tr><th>${i18n.t('phovea:ui.version')}</th><td>${build.version}</td></tr>
              ${this.server ? `<tr><th>Server</th><td>${this.server.version}</td></tr>` : ''}
              <tr><th>${i18n.t('phovea:ui.url')}</th><td><code>${location.pathname}${location.hash}</code></td></tr>
              <tr><th>${i18n.t('phovea:ui.userAgent')}</th><td>${navigator.userAgent}</td></tr>
              <tr><th>${i18n.t('phovea:ui.github')}</th><td><a href="${build.resolved.replace(/(\.git|\/commit\/).*/, '/issues/new')}" target="_blank">${i18n.t('phovea:ui.submitIssue')}</a></td></tr>
            </tbody>
            </table>`;
  }

  private buildIssuesContent() {
    // don't use location.href, since I don't wanna expose server names
    return `
    ${i18n.t('phovea:ui.issueHeader')}
    ${i18n.t('phovea:ui.separator')}
    ${i18n.t('phovea:ui.applicationRow', {name: this.client.name})}
    ${i18n.t('phovea:ui.versionRow', {version: this.client.version, resolved: this.client.resolved})}${this.server ? i18n.t('phovea:ui.serverRow', {version: this.server.version, resolved: this.server.resolved}) : ''}
    ${i18n.t('phovea:ui.urlRow', {pathname: location.pathname, hash: location.hash})}
    ${i18n.t('phovea:ui.userAgentRow', {userAgent: navigator.userAgent})}
    ${i18n.t('phovea:ui.platformRow', {platform: navigator.platform})}
    ${i18n.t('phovea:ui.screenSizeRow', {width: screen.width, height: screen.height})}
    ${i18n.t('phovea:ui.windowSizeRow', {innerWidth: window.innerWidth, innerHeight: window.innerHeight})}

~~~json\n${JSON.stringify(this.client, null, ' ')}\n${this.server ? `\n${JSON.stringify(this.server, null, ' ')}\n` : ''}~~~`;
  }

  toHTML() {
    return `
      <h4>${i18n.t('phovea:ui.buildInfo')}</h4>
      ${this.buildBuildInfo()}
      <h4>${i18n.t('phovea:ui.buildDetails')}</h4>
      <textarea readonly="readonly">${this.buildIssuesContent()}</textarea>
    `;
  }

  static build(): Promise<BuildInfo> {
    const buildInfos = Promise.all([
      (<any>self).fetch('./buildInfo.json').then((response) => response.json()),
      offline ? null : getAPIJSON('/buildInfo.json')
    ]);
    return buildInfos.then((args: any[]) => new BuildInfo(args[0], args[1]));
  }
}


