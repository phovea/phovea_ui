/**
 * Created by Samuel Gratzl on 21.11.2016.
 */

import {getAPIJSON} from 'phovea_core/src/ajax';
import {offline} from 'phovea_core/src';

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
              <tr><th>Application</th><td>${build.name}</td></tr>
              <tr><th>Version</th><td>${build.version}</td></tr>
              ${this.server ? `<tr><th>Server</th><td>${this.server.version}</td></tr>`: ''}
              <tr><th>Url</th><td><code>${location.pathname}${location.hash}</code></td></tr>
              <tr><th>UserAgent</th><td>${navigator.userAgent}</td></tr>
              <tr><th>GitHub</th><td><a href="${build.resolved.replace(/(\.git|\/commit\/).*/, '/issues/new')}" target="_blank">Submit Issue (include the build details below)</a></td></tr>
            </tbody>
            </table>`;
  }

  private buildIssuesContent() {
    // don't use location.href, since I don't wanna expose server names
    return `
Key | Value
--- | -----
Application | ${this.client.name}
Version | [${this.client.version}](${this.client.resolved})${this.server ? `\nServer | [${this.server.version}](${this.server.resolved})`: ''}
Url | \`${location.pathname}${location.hash}\`
UserAgent | ${navigator.userAgent}
Platform | ${navigator.platform}
Screen Size | ${screen.width} x ${screen.height}
Window Size | ${window.innerWidth} x ${window.innerHeight}

~~~json\n${JSON.stringify(this.client, null, ' ')}\n${this.server ? `\n${JSON.stringify(this.server, null, ' ')}\n`: ''}~~~`;
  }

  toHTML() {
    return `
      <h4>Build Info</h4>
      ${this.buildBuildInfo()}
      <h4>Build Details</h4>
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
