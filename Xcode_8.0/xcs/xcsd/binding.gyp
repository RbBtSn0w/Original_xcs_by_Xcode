{
    "targets": [
        {
            "target_name": "logger",
            "sources": [ "util/logger.mm" ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ],
            "link_settings": {
                "libraries": [
                    "-framework",
                    "Foundation"
                ]
            }
        }
    ]
}
