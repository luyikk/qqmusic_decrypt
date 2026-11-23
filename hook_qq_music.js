const TARGET_DLL = "QQMusicCommon.dll";

var qqModule = Process.getModuleByName(TARGET_DLL);

var EncAndDesMediaFileConstructorAddr = qqModule.findExportByName(
  "??0EncAndDesMediaFile@@QAE@XZ"
);

var EncAndDesMediaFileDestructorAddr = qqModule.findExportByName(
  "??1EncAndDesMediaFile@@QAE@XZ"
);

var EncAndDesMediaFileOpenAddr = qqModule.findExportByName(
  "?Open@EncAndDesMediaFile@@QAE_NPB_W_N1@Z"
);

var EncAndDesMediaFileGetSizeAddr = qqModule.findExportByName(
  "?GetSize@EncAndDesMediaFile@@QAEKXZ"
);

var EncAndDesMediaFileReadAddr = qqModule.findExportByName(
  "?Read@EncAndDesMediaFile@@QAEKPAEK_J@Z"
);

var EncAndDesMediaFileConstructor = new NativeFunction(
  EncAndDesMediaFileConstructorAddr,
  "pointer",
  ["pointer"],
  "thiscall"
);

var EncAndDesMediaFileDestructor = new NativeFunction(
  EncAndDesMediaFileDestructorAddr,
  "void",
  ["pointer"],
  "thiscall"
);

var EncAndDesMediaFileOpen = new NativeFunction(
  EncAndDesMediaFileOpenAddr,
  "bool",
  ["pointer", "pointer", "bool", "bool"],
  "thiscall"
);

var EncAndDesMediaFileGetSize = new NativeFunction(
  EncAndDesMediaFileGetSizeAddr,
  "uint32",
  ["pointer"],
  "thiscall"
);

var EncAndDesMediaFileRead = new NativeFunction(
  EncAndDesMediaFileReadAddr,
  "uint",
  ["pointer", "pointer", "uint32", "uint64"],
  "thiscall"
);

rpc.exports = {
  decrypt: function (srcFileName, tmpFileName) {    
    var EncAndDesMediaFileObject = Memory.alloc(0x28);
    EncAndDesMediaFileConstructor(EncAndDesMediaFileObject);

    var fileNameUtf16 = Memory.allocUtf16String(srcFileName);
    EncAndDesMediaFileOpen(EncAndDesMediaFileObject, fileNameUtf16, 1, 0);

    var fileSize = EncAndDesMediaFileGetSize(EncAndDesMediaFileObject);

    var buffer = Memory.alloc(fileSize);
    EncAndDesMediaFileRead(EncAndDesMediaFileObject, buffer, fileSize, 0);

    var data = buffer.readByteArray(fileSize);
    EncAndDesMediaFileDestructor(EncAndDesMediaFileObject);

    var tmpFile = new File(tmpFileName, "wb");
    tmpFile.write(data);
    return true
  },
};