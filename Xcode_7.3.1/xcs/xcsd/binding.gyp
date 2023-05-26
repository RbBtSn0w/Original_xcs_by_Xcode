{
    "targets": [
        {
            "target_name": "logger",
            "sources": [ "util/logger.cc" ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ]
        }
    ]
}
