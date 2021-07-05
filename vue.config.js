////module.exports = {
////    publicPath: process.env.VUE_APP_VIRTUALPATH,
////    devServer: {
////        // proxy: 'https://localhost:5001' //Se agrega el proxy para hacer la redireccion al puerto donde se escuentran los controllers

////        proxy: {
////            "^/v1*": {
////                target: 'https://localhost:44353',
////                ws: true,
////                changeOrigin: true,
////                secure: false
////            }
////        }
////    },
////};

module.exports = {
    devServer: {
        proxy: 'http://dog.ceo'
    }
}

//module.exports = {
//    devServer: {
//        proxy: {
//            '/V1': {
//                target: 'http://localhost:8888',
//                changeOrigin: true,
//                pathRewrite: {
//                    '^/V1': ''
//                }
//            }

//        }
//    }
//}