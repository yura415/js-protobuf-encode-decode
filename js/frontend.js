(function () {
    "use strict";
    var encoded = document.getElementById("encoded")
        , decoded = document.getElementById("decoded")
        , proto = document.getElementById("proto")
        , protoRoot;

    encoded.addEventListener("keyup", function () {
        decode();
    });

    decoded.addEventListener("keyup", function () {
        encode();
    });

    proto.addEventListener("change", function () {
        updateProto();
    });

    function toUint8Array(hexString) {
        return new Uint8Array(hexString.match(/\w{2}/g).map(function(byte) {
            return parseInt(byte, 16);
        }));
    }

    function fromUint8Array(buffer) {
        var first = true
        return buffer.reduce(function(str, byte) {
            var space = first ? '' : ' ';
            first = false;
            return str + space + byte.toString(16).padStart(2, '0').toUpperCase();
        }, '');
    }

    function decode() {
        decoded.value = "";
        try {
            if (!encoded.value) return;
            var payload = toUint8Array(encoded.value);
            var message = protoRoot.root.nestedArray[0];

            decoded.value = JSON.stringify(message.decode(payload), null, 2);
        } catch (e) {
            decoded.value = "Error:\n" + e.toString();
            console.error(e);
        }
    }

    function updateProto() {
        try {
            protoRoot = protobuf.parse(proto.value);
            decode();
        } catch (e) {
            decoded.value = "Error:\n" + e.toString();
            console.error(e);
        }
    }

    function encode() {
        encoded.value = "";
        try {
            if (!decoded.value) return;
            var message = protoRoot.root.nestedArray[0];
            var payload = JSON.parse(decoded.value);

            var err = message.verify(payload);
            if (err) throw err;

            var buffer = message.encode(payload).finish()
            encoded.value = '<' + fromUint8Array(buffer) + '>';
        } catch (e) {
            encoded.value = "Error:\n" + e.toString();
            console.error(e);
        }
    }

    updateProto();
}());