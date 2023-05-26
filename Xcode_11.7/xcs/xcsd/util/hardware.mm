#include <nan.h>
#include <stdio.h>

#import <Foundation/Foundation.h>
#import <SystemConfiguration/SystemConfiguration.h>

using namespace v8;

NAN_METHOD(GetComputerName) {
    NSString *host = CFBridgingRelease(SCDynamicStoreCopyComputerName(NULL, NULL));
    if (!host) {
        info.GetReturnValue().SetNull();
        return;
    }

    Nan::MaybeLocal<String> maybeHost = Nan::New(host.UTF8String);
    if (maybeHost.IsEmpty()) {
        info.GetReturnValue().SetNull();
    } else {
        info.GetReturnValue().Set(maybeHost.ToLocalChecked());
    }
}

NAN_METHOD(GetHardwareUUID) {
    io_service_t platformExpert = IOServiceGetMatchingService(kIOMasterPortDefault, IOServiceMatching("IOPlatformExpertDevice"));
    if (!platformExpert) {
        info.GetReturnValue().SetNull();
        return;
    }

    NSString *hardwareUUID = CFBridgingRelease(IORegistryEntryCreateCFProperty(platformExpert, CFSTR(kIOPlatformUUIDKey), kCFAllocatorDefault, 0));
    if (hardwareUUID) {
        Nan::MaybeLocal<String> maybeHardwareUUID = Nan::New(hardwareUUID.UTF8String);
        if (maybeHardwareUUID.IsEmpty()) {
            info.GetReturnValue().SetNull();
        } else {
            info.GetReturnValue().Set(maybeHardwareUUID.ToLocalChecked());
        }
    } else {
        info.GetReturnValue().SetNull();
    }

    IOObjectRelease(platformExpert);
}

NAN_MODULE_INIT(HardwareInit) {
    Nan::SetMethod(target, "getComputerName", GetComputerName);
    Nan::SetMethod(target, "getHardwareUUID", GetHardwareUUID);
}

NODE_MODULE(hardware, HardwareInit)
