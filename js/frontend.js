(function () {
    "use strict";
    var encoded = document.getElementById("encoded")
        , decoded = document.getElementById("decoded")
        , proto = document.getElementById("proto")
        , protoType;

    encoded.addEventListener("keyup", function () {
        decode();
    });

    decoded.addEventListener("keyup", function () {
        encode();
    });

    proto.addEventListener("change", function () {
        updateProto();
    });

    function decode() {
        decoded.value = "";
        try {
            if (!encoded.value) return;
            var buffer = dcodeIO.ByteBuffer.fromDebug(encoded.value);
            var decodedObject = protoType.decode(buffer);
            decoded.value = JSON.stringify(decodedObject, null, 2);
        } catch (e) {
            decoded.value = "Error:\n" + e.toString();
        }
    }

    function updateProto() {
        try {
            var loadedProto = dcodeIO.ProtoBuf.loadProto(proto.value);
            protoType = loadedProto.build();
            protoType = protoType[Object.keys(protoType)[0]];
            decode();
        } catch (e) {
            decoded.value = "Error:\n" + e.toString();
        }
    }

    function encode() {
        encoded.value = "";
        try {
            if (!decoded.value) return;
            var protoObject = new protoType(JSON.parse(decoded.value));
            var encodedBuffer = protoObject
                .encode();
            encoded.value = encodedBuffer.toDebug();
        } catch (e) {
            encoded.value = "Error:\n" + e.toString();
            throw e;
        }
    }

    updateProto();
}());