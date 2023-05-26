{
    "targets": [
        {
            "target_name": "logger",
            "sources": [ "util/logger.mm" ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ],
            "libraries": [
                "$(SDKROOT)/System/Library/Frameworks/Foundation.framework",
            ]
        },
        {
            "target_name": "hardware",
            "sources": [ "util/hardware.mm" ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ],
            "libraries": [
                "$(SDKROOT)/System/Library/Frameworks/Foundation.framework",
                "$(SDKROOT)/System/Library/Frameworks/SystemConfiguration.framework"
            ]
        }
    ]
}
