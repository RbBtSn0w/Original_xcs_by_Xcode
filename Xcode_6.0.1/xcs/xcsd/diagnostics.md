# Local Diagnostics System

`xcsd` provides a local diagnostics system at http://localhost:3000/diagnostics/. The purpose of this system is to provide a way to debug any Xcode Server processor running on the local machine (i.e., the machine on which you visit the website). To facilitate this, the major processes operate debug servers that listen for WebSocket connections from the user's browser. For projects that consume `XCSCore`, this is provided via the `XCSDiagnosticsServer` class. For other processes that need debugging (like `xcsd` itself), the protocol is documented below.

## Message Format

Because we use raw WebSocket for this, not Socket.io, we need to use our own custom message format. Every message sent on the socket should be of the following form:

    {
        "type": "status",
        "data": ...
    }

In other words, the type of event (from the list described below) is always in the `type` attribute, and whatever payload needs to be sent (an object, a string, an array, etc.) will be the `data` attribute.

## Messages Sent by Server Processes

### status

Immediately after receiving a connection from the debug tool, the service should emit a `status` event. This alerts the debug tool that the connection was successful, and informs it of any issues that may be relevant.

    {
        "type": "status",
        "data": {
            "issues": []
        }
    }

If the process is operating normally, and is in the "all-clear" state, the message above should be emitted (with an empty issues array). If, however, there are any issues that may be useful for the user to know about, they should be provided in the issues array. Each issue should be an object containing a message (required), a title (optional), and a type code (optional).

    {
        "type": "status",
        "data": {
            "issues": [
                {
                    "title": "Invalid Client Certificate",
                    "message": "xcsd is reporting that the build service's client certificate is invalid.",
                    "type": "client-cert-invalid"
                }
            ]
        }
    }

The type code is something agreed upon by the process and the debug tool, and will enable the debug tool to take corrective actions. For instance, in the case above, since the debug tool knows what to do for the "client-cert-invalid" message (i.e., begin the process of requesting a new certificate), it will additionally display a "Fix This" button that begins the certificate assistant.

**Note well** that as issue status changes -- e.g., issues are resolved, or new ones appear -- the server process should re-emit a status message.
