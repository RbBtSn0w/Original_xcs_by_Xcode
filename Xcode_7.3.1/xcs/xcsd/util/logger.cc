#include <nan.h>
#include <asl.h>
#include <stdio.h>

using namespace v8;

static asl_object_t logClient;

NAN_METHOD(LogMessage) {
    Local<Integer> level = info[0].As<Integer>();
    String::Utf8Value message(info[1]);
    Local<Object> props = info[2].As<Object>();

    Local<Array> propertyNames = props->GetOwnPropertyNames();
    aslmsg msg = asl_new(ASL_TYPE_MSG);
    for (uint32_t i = 0; i < propertyNames->Length(); i++) {
        Local<Value> keyValue = propertyNames->Get(i);
        String::Utf8Value key(keyValue);
        String::Utf8Value value(props->Get(keyValue));

        asl_set(msg, *key, *value);
    }

    asl_log(logClient, msg, level->Value(), "%s", *message);
    info.GetReturnValue().SetUndefined();
}

NAN_METHOD(SetLogFacility) {
    String::Utf8Value newFacilityName(info[0]);

    if (logClient) {
        asl_close(logClient);
    }

    logClient = asl_open(NULL, *newFacilityName, 0);
    asl_set_filter(logClient, ASL_FILTER_MASK_UPTO(ASL_LEVEL_DEBUG));

    info.GetReturnValue().SetUndefined();
}

NAN_MODULE_INIT(LoggerInit) {
    Nan::SetMethod(target, "setFacility", SetLogFacility);
    Nan::SetMethod(target, "logMessage", LogMessage);
}

NODE_MODULE(logger, LoggerInit)
