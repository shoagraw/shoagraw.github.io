/*jslint browser: true*/
/*jshint unused:false*/
/*jshint -W030 */
var Accept = (function BootstrapMe() {
'use strict';
 // window.cdnPath = "../../../AnetJs";// for Jasmine
    //  window.cdnPath = "..";// local   /deploy/
        //window.cdnPath = "https://{[sfe[vip[2]]]}";// local
        //var cdnPath = "https://jsbyz.labwebapp.com/v1/"; //test
        //var cdnPath = "https://jsint.authorize.net"; //int
        //var cdnPath = "https://jsstg.authorize.net"; //stage
        //var cdnPath = "https://jstest.authorize.net" //cert
        // var cdnPath = "https://js.authorize.net" //prod

        // request URL
        // TEST
        window.cdnPath = "";// for local
        //window.cdnPath = window.cdnPath +"/v1/";
        // window.cdnPath = window.cdnPath +"/v1/deploy/";
        window.encryptEndPoint = "https://downloadvpossoa.labwebapp.com";
        //window.encryptEndPoint = "__WCO_Domain__";

        
        // INT
        /*
        var encryptEndPoint = "https://downloadvposint.labwebapp.com";
        */

        // STAGE
        /*
        var encryptEndPoint = "https://downloadvposstg.labwebapp.com";
        */

        // PROD
        /*
        var encryptEndPoint = "https://api.authorize.net";
        */

        /*// cert
        var jsURL = "https://jstest.authorize.net";
        var encryptEndPoint = "https://apitest.authorize.net";
        */
        
    
    
    function testHash(obj) {
        var m;
        if ((m = FingerPrint.hash(obj.responseText)) && m ? m = m !== "c8e10db1d04e6bfa265be02db3393a8e1e6373cc2880a593ef13f784c695e010" : 0) {//f94deae9e135a1d606ae4fee5127e5c282c00b329d7b863ef5ecfd69d34f2b42
            console.warn("Library is not coming from Accept server--- "+FingerPrint.hash(obj.responseText));
            setTimeout(clearEncrypt, 2000);
        }
        obj = undefined;
    }
    /**
     * Used to send bootstrap error to merchant page .
     */
    var clearEncrypt = function () {
        Accept.dispatchData = function(args , callback) {
            var response = {
                    "messages" : {
                        "resultCode": "Ok" ,
                        "message" :[]
                    }
            };
            response.messages.resultCode = "Error";
            response.messages.message.push({
                "code": "E_WC_03",
                "text": "Accept.js is not loaded correctly"
            });
            ( typeof callback === "function" ) ? callback.call(null,response): window[callback](response);
        };
    };

    /**
     * Load script from AuthrizeNet CDN using Ajax call.
     */
    function loadAjax(url, myMethod) {
         var xobj = null;
        if (typeof XDomainRequest != "undefined"){
              xobj = new XDomainRequest();
         }
        else{
              xobj = new XMLHttpRequest();
              //xobj.setRequestHeader("Authorization", "Negotiate");
          }
      
        xobj.open("get", url,true);
        xobj.send();
        xobj.onload  = function (){setTimeout(function(){ 
          myMethod(xobj), 2000});
        };
    }
    
   /**
    * Load script from AuthrizeNet CDN in head section .
    */
    function loadScript(url) {
            var myScripts = document.createElement("script");
            myScripts.type = "text/javascript";
            myScripts.src = url;
            (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(myScripts);
        }
        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
        /*  SHA-256 implementation in JavaScript                (c) Chris Veness 2002-2014 / MIT Licence  */
        /*                                                                                                */
        /*                             */
        /*                                          */
        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    /* jshint node:true */
    /* global  escape, unescape */

    /**
     * SHA-256 hash function reference implementation.
     *
     * @namespace
     */
    var FingerPrint = {};


    /**
     * Generates SHA-256 hash of string.
     *
     * @param   {string} msg - String to be hashed
     * @returns {string} Hash of msg as hex character string
     */
    FingerPrint.hash = function(msg) {
        // convert string to UTF-8, as SHA only deals with byte-streams
        msg = msg.utf8Encode();

        // constants [§4.2.2]
        var K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        // initial hash value [§5.3.1]
        var H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];

        // PREPROCESSING 

        msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

        // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
        var l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
        var N = Math.ceil(l / 16); // number of 16-integer-blocks required to hold 'l' ints
        var M = new Array(N);

        for (var i = 0; i < N; i++) {
            M[i] = new Array(16);
            for (var j = 0; j < 16; j++) { // encode 4 chars per integer, big-endian encoding
                M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                    (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
            } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
        }
        // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
        // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
        // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
        M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
        M[N - 1][14] = Math.floor(M[N - 1][14]);
        M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;


        // HASH COMPUTATION [§6.1.2]

        var W = new Array(64);
        var a, b, c, d, e, f, g, h;
        for (i = 0; i < N; i++) {

            // 1 - prepare message schedule 'W'
            for (var t = 0; t < 16; t++) W[t] = M[i][t];
            for (t = 16; t < 64; t++) W[t] = (FingerPrint.σ1(W[t - 2]) + W[t - 7] + FingerPrint.σ0(W[t - 15]) + W[t - 16]) & 0xffffffff;

            // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
            a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
            // 3 - main loop (note 'addition modulo 2^32')
            for (t = 0; t < 64; t++) {
                var T1 = h + FingerPrint.Σ1(e) + FingerPrint.Ch(e, f, g) + K[t] + W[t];
                var T2 = FingerPrint.Σ0(a) + FingerPrint.Maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) & 0xffffffff;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) & 0xffffffff;
            }
            // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
            H[0] = (H[0] + a) & 0xffffffff;
            H[1] = (H[1] + b) & 0xffffffff;
            H[2] = (H[2] + c) & 0xffffffff;
            H[3] = (H[3] + d) & 0xffffffff;
            H[4] = (H[4] + e) & 0xffffffff;
            H[5] = (H[5] + f) & 0xffffffff;
            H[6] = (H[6] + g) & 0xffffffff;
            H[7] = (H[7] + h) & 0xffffffff;
        }

        return FingerPrint.toHexStr(H[0]) + FingerPrint.toHexStr(H[1]) + FingerPrint.toHexStr(H[2]) + FingerPrint.toHexStr(H[3]) +
            FingerPrint.toHexStr(H[4]) + FingerPrint.toHexStr(H[5]) + FingerPrint.toHexStr(H[6]) + FingerPrint.toHexStr(H[7]);
    };


    /**
     * Rotates right (circular right shift) value x by n positions [§3.2.4].
     * @private
     */
    FingerPrint.ROTR = function(n, x) {
        return (x >>> n) | (x << (32 - n));
    };

    /**
     * Logical functions [§4.1.2].
     * @private
     */
    FingerPrint.Σ0 = function(x) {
        return FingerPrint.ROTR(2, x) ^ FingerPrint.ROTR(13, x) ^ FingerPrint.ROTR(22, x);
    };
    FingerPrint.Σ1 = function(x) {
        return FingerPrint.ROTR(6, x) ^ FingerPrint.ROTR(11, x) ^ FingerPrint.ROTR(25, x);
    };
    FingerPrint.σ0 = function(x) {
        return FingerPrint.ROTR(7, x) ^ FingerPrint.ROTR(18, x) ^ (x >>> 3);
    };
    FingerPrint.σ1 = function(x) {
        return FingerPrint.ROTR(17, x) ^ FingerPrint.ROTR(19, x) ^ (x >>> 10);
    };
    FingerPrint.Ch = function(x, y, z) {
        return (x & y) ^ (~x & z);
    };
    FingerPrint.Maj = function(x, y, z) {
        return (x & y) ^ (x & z) ^ (y & z);
    };


    /**
     * Hexadecimal representation of a number.
     * @private
     */
    FingerPrint.toHexStr = function(n) {
        // note can't use toString(16) as it is implementation-dependant,
        // and in IE returns signed numbers when used on full words
        var s = "",
            v;
        for (var i = 7; i >= 0; i--) {
            v = (n >>> (i * 4)) & 0xf;
            s += v.toString(16);
        }
        return s;
    };


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    if(document.readyState === "complete") {
        registerMe();
    }
    else {
      if (window.addEventListener) {
            window.addEventListener("load", registerMe, false);
        } else if (window.attachEvent) {
            window.attachEvent("onload", registerMe);
        } else if (window.onLoad) {
            window.onload = registerMe;
        }
    }
    
    

    /** Extend String object with method to encode multi-byte string to utf8
     *  - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
    if (typeof String.prototype.utf8Encode == "undefined") {
        String.prototype.utf8Encode = function() {
            return unescape(encodeURIComponent(this));
        };
    }

    /** Extend String object with method to decode utf8 string to multi-byte */
    if (typeof String.prototype.utf8Decode == "undefined") {
        String.prototype.utf8Decode = function() {
            try {
                return decodeURIComponent(escape(this));
            } catch (e) {
                return this; // invalid UTF-8? return as-is
            }
        };
    }
    loadScript(cdnPath+"AcceptCore.js");
    loadAjax(cdnPath+"AcceptCore.js", testHash);

    function dispatchData(args , callback) {
        console.warn("Accept.js is not loaded correctly");
        var response = {
                 "messages" : {
                    "resultCode": "Ok" ,
                    "message" :[]
                }
        };
        response.messages.resultCode = "Error";
        response.messages.message.push({
            "code": "E_WC_03",
            "text": "Accept.js is not loaded correctly"
        });
        ( typeof callback === "function" ) ? callback.call(null,response): window[callback](response);
        
        
    }

    function registerMe() {
        var p = document.getElementsByTagName("body")[0];
        p.addEventListener("handshake", function() {
            window.isReady = true;
        }, false);
    }

    return {
        dispatchData: dispatchData
    };
})();
