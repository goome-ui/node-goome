{
  "targets": [
    {
      "target_name": "goome",
      "sources": ["native/goome_lib.c", "src/addon.c"],
      "include_dirs": ["native"],
      "cflags_c": ["-std=c99", "-Wall", "-Wno-unused-parameter", "-Wno-missing-field-initializers"],
      "xcode_settings": {
        "MACOSX_DEPLOYMENT_TARGET": "11.0",
        "GCC_C_LANGUAGE_STANDARD": "c99"
      },
      "msvs_settings": {
        "VCCLCompilerTool": { "WarningLevel": 3 }
      },
      "defines": ["NAPI_VERSION=8"]
    }
  ]
}
