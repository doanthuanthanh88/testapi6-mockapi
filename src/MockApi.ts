import Koa from 'koa'
import { Tag } from "testapi6/dist/components/Tag"
import cors from '@koa/cors'
import Router from '@koa/router'
import chalk from 'chalk'
import serve from 'koa-static'
import { Testcase } from "testapi6/dist/components/Testcase";
import { context } from 'testapi6/dist/Context'
import { Input } from 'testapi6/dist/components'
import http from 'http'
import https from 'https'

/**
 * Create a mock API service
 * 
 * ```yaml
 * - MockApi:
 *     title: Start mock server
 *     port: 443
 *     host: 0.0.0.0
 *     https: true
 *     # https:
 *     #   key: https key string
 *     #   cert: https cert string
 *     routers:
 *       - root: assets
 *       - method: GET
 *         path: /test/:name
 *         data: [
 *           { name: 1 },
 *           { name: 2 }
 *         ] 
 * ```
 */
export class MockApi extends Tag {
  /** Server port */
  port?: number
  /** Server address */
  host?: string
  /** Server scheme */
  https?: {
    /** Key for https */
    key: string
    /** Key Cert for https */
    cert: string
  } | boolean
  /** Define routers */
  routers: {
    /** Serve static files in these folders */
    root: string
  }[] | {
    /** Http method */
    method: string | string[]
    /** Http request path */
    path: string
    /** Respnse status */
    status?: number
    /** Response status text */
    statusText?: string
    /** Response headers */
    headers?: any
    /** Response data */
    data?: any
  }[]

  _app?: Koa
  _router?: Router
  _server?: http.Server | https.Server

  constructor(attrs: MockApi) {
    super(attrs)
    this._app = new Koa()
    this._app.use(cors())
    this._router = new Router()
  }

  prepare() {
    super.prepare()
    this.routers.forEach(r => {
      if (r.root) {
        context.log(chalk.gray(`- GET ${Testcase.getPathFromRoot(r.root)}/**/*.*`))
        this._app.use(serve(Testcase.getPathFromRoot(r.root)))
      } else {
        if (!r.method) r.method = 'GET'
        if (r.path) {
          context.log(chalk.gray(`- ${r.method} ${r.path}`))
          this._router.register(r.path, Array.isArray(r.method) ? r.method : [r.method], (ctx, next) => {
            if (r.status) ctx.status = r.status
            if (r.statusText) ctx.message = r.statusText
            ctx.body = r.data
            return next()
          })
        }
      }
    })
    if (!this.host) this.host = '0.0.0.0'
    if (!this.port) this.port = this.scheme === 'http' ? 80 : 443
  }

  get scheme() {
    return this.https ? 'https' : 'http'
  }

  private get httpObject() {
    return this.scheme === 'http' ? http : https
  }

  private get serverOption() {
    return this.scheme === 'http' ? {} : {
      key: (typeof this.https !== 'boolean' && this.https?.key) || KEY,
      cert: (typeof this.https !== 'boolean' && this.https?.cert) || CERT
    }
  }

  start() {
    return new Promise((r: Function) => {
      this._app
        .use(this._router.routes())
        .use(this._router.allowedMethods());
      this._server = this.httpObject.createServer(this.serverOption, this._app.callback())
      this._server.listen(this.port, this.host, () => {
        return r()
      });
    })
  }

  async exec() {
    context.group(chalk.green(this.title))
    context.groupEnd()

    await this.start() as any
    context.log(chalk.green('Listening at %s://%s:%d'), this.scheme, this.host, this.port)

    return new Promise(async (resolve, reject) => {
      // Listen to force stop
      context.once('app:stop', async () => {
        this._server?.close(err => {
          context.error(err?.message, err?.stack)
          reject(err)
        })
      })

      const inp = new Input({
        title: `Enter to stop the service "${this.title}" !`
      })
      inp.setup(this.tc)
      inp.prepare()
      await inp.exec()
      this._server.close(err => {
        if (err) return reject(err)
        resolve(undefined)
      })
    })
  }
}

const KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAynRSsMcDagvV86OaKAmi3Y7GfUnuYm6IG0PpaNEPD+F/LNNO
vHGbFouYbHNX6RvejmJVGg9iQGYUnLgY4qipOplaZRKF1kiWzvCJ6xyVaMhKHlEo
l5cwJrJj9cR8mMWRHBdnw4RcXultEooh0CYVl61YDF00mkOSK4ySNwyFKavOzLM9
ulMDt2hZnD6OWVw+m2FzdMAqsSsjt4bm92mc73Ei2TN/Fb4TEETGyBGpFZUPfUUb
5MQsjb4daAILmeRDLBX199DVtn2fXCfM7DqnWGn6D25cfQ7cmzkqm18BN0kPDfEV
NSY2J1hAqHDYSBpcg30imbKmmQ6FgP6BMy/dQwIDAQABAoIBAFF9Lsd+423s46pU
oLka39ZEILrPZkdybBBlbm7FL0XaIwFc8GVDaQRTHgAREUJ/+D3hcJWzuX1oWUWX
iFS7RJqUnWDvarWMtD8JbMoY0D7D16mKS0dxEG2TAk8rTmeDplvjQ93byf5eAIwk
02Vf3vMVT8pyPbkWF6C1zSihPnw9tsisSz9s1p7hve1g/98c1D3xWJSj6ATV6I4I
5vP9SQMiiKirLcaKVj7RsVG3wFs40dQrmsLX6mJeW1VBrj80Ie5+U/EnjIWntE5H
OIC+FUaQdI/oO5gsM54DgVJBawxHyCrvxK52nS1bgVo48e0HLSITilXwaX3mvhTS
VMNUR1ECgYEA8N7RO4PUer+xf91G4mnTWrQlY+KYUzXuZT52/F5fVFCdEDW3ogqh
LUoHxJM2tCoQQzMQ57pTPsT4YC725Pb7VxjwnslCWNEd+AwRXGccDNjV4DFrRD74
Nh/12NnYX5N/S7beQEOykzPt06eTeUmYcLVrZDGhm9/Le52MpKlpqVkCgYEA1yvH
Uk7zAqDakNBl1jpGAIjIaieVbi2mJJOUpcXxAzzORXrBPOsz6NHz1Xu336DPciwW
CFXGlImFD29cTm09PrHGtLYCh60JJXbaT7fv8/CwdPipxJMQkUjMIgBivZKkQATd
omiaXxYTAj6mz1OCh+v99iy5j0Rswl5/CObQC/sCgYAssDpDf3bpey00Wtpu4VFs
L6YMPRsjvQrIz+kFc4DeRMKPIlg6gRxcKbL9Po7UqEUyIoRNad1N9P9b4Pq/ii8h
fqgN3asojUuxHJQP/7VNkOFFYgXTuJcWe6GCJRCm0te4NWpQo/66ntTOAvYyd3wH
1TDieu7P25qGCbnxRtkqqQKBgAqp8MbzgreuoSZsLZ/gY3fDT6tzKsS7HnDRn5xX
owo2CUMIQmtyfLAdN6hs6T/8CEvwQ2dGWQEjj6SkMD7yywZAaUirfJSczsc8jLVG
uG2ukBA8Aq3rW/bXVMaankom6l0B4Lob1QrBXU/PKxU7Xky+NWft74RaL8myRTl7
tvPhAoGBALFvxPDmPmN/sNIQrMmFB9aakjSzzKEwPuLQAZfm/cUP3uRzh3g+rA+I
F1Z81tlFlCBbNvbBFu4OAdzvs5eD+OmEX/g7RHwalPgTd2PFqbHnB9gDdIv/4FFh
qxLCaZQzqr8sDtbGfYiWc3utfUKS4gqSTMLm2IvJ/bz09ATbkGE4
-----END RSA PRIVATE KEY-----
`

const CERT = `-----BEGIN CERTIFICATE-----
MIIDIDCCAggCCQD5jt6BwlNWnTANBgkqhkiG9w0BAQUFADBSMQswCQYDVQQGEwJW
TjELMAkGA1UECAwCSE4xCzAJBgNVBAcMAkxZMSkwJwYJKoZIhvcNAQkBFhpkb2Fu
dGh1YW50aGFuaDg4QGdtYWlsLmNvbTAeFw0yMTAzMDgwNzM0MjZaFw0yMTA0MDcw
NzM0MjZaMFIxCzAJBgNVBAYTAlZOMQswCQYDVQQIDAJITjELMAkGA1UEBwwCTFkx
KTAnBgkqhkiG9w0BCQEWGmRvYW50aHVhbnRoYW5oODhAZ21haWwuY29tMIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAynRSsMcDagvV86OaKAmi3Y7GfUnu
Ym6IG0PpaNEPD+F/LNNOvHGbFouYbHNX6RvejmJVGg9iQGYUnLgY4qipOplaZRKF
1kiWzvCJ6xyVaMhKHlEol5cwJrJj9cR8mMWRHBdnw4RcXultEooh0CYVl61YDF00
mkOSK4ySNwyFKavOzLM9ulMDt2hZnD6OWVw+m2FzdMAqsSsjt4bm92mc73Ei2TN/
Fb4TEETGyBGpFZUPfUUb5MQsjb4daAILmeRDLBX199DVtn2fXCfM7DqnWGn6D25c
fQ7cmzkqm18BN0kPDfEVNSY2J1hAqHDYSBpcg30imbKmmQ6FgP6BMy/dQwIDAQAB
MA0GCSqGSIb3DQEBBQUAA4IBAQBBbt1vIAfn7+NNGJqcq8JoQMkNutP4Lay4/ejs
rTU/ucjDeHcpW+6iBPyANfPaAyua3Wjr9A3RXtcPOni1Zt8QqmV5N7VI+wS1FLdL
3e25MFrvvgPaQvU1C9WltL0KD80/yP4zd5kVvviG/gKyCE8XwfovmLy+1rMErO0C
+gjG6O0COdYMSTdm3bHfntmyGiNvBgyRmMOnDkLSGO/dvKGjroffxNVDe0xAmi7W
SDhm47OwPFXyyHp+ObPLYcfK0wZ23J2Inj24VNw6uwhRoWij66j4zh/VqfciiA5B
zsqKxI1xw5qstqlVX3MQR6n8xTfr2Ec6W3lGbtuQ0MEHYbT8
-----END CERTIFICATE-----
`
