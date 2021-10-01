export { HttpServer, HttpsServer } from './MockServer'

// import { HttpServer } from './MockServer'

// const m = new HttpServer()
// m.init({
//   title: 'test',
//   port: 5000,
//   routers: [
//     {
//       method: 'POST',
//       path: '/upload',
//       uploadTo: '/Users/doanthuanthanh/code/github/testapi6-mockapi/src'
//     },
//     {
//       serveIn: '/Users/doanthuanthanh/code/github/testapi6-mockapi/src'
//     },
//     {
//       method: 'POST',
//       path: '/test/:id',
//       response: {
//         status: 200,
//         statusMessage: 'OK',
//         headers: {
//           server: 'nginx'
//         },
//         data: {
//           queryName: '${$query.class}',
//           headerName: '${$headers.authorization}',
//           paramsName: '${$params.id}',
//           reqObj: '${$req.method}',
//           body: '${$body}'
//         }
//       }
//     }
//   ]
// } as HttpServer)
// m.prepare()
// m.exec()