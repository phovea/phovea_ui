/**
 * Created by Samuel Gratzl on 21.11.2016.
 */

export class BuildInfo {
  constructor(private buildInfo: any) {

  }

  toString() {
    return 'BuildInfo';
  }

  toHTML() {
    const result = this.buildInfo;
    return `
          <h4>Build Info</h4>
          <p>
              Application: ${result.name} <br>
              Version: ${result.version} <br>
              GitHub: <a href="${result.resolved.replace(/\.git.*/, '/issues/new')}" target="_blank">Submit Issue (include the build info below)</a>
          </p>
          <h4>Build Details</h4>
          <textarea readonly="readonly">~~~json\n${JSON.stringify(result, null, ' ')}\n~~~</textarea>
          `;
  }
}

export default function build(): Promise<BuildInfo> {
  return (<any>self).fetch('./buildInfo.json').then((response) => response.json()).then((result: any) => new BuildInfo(result));
}
