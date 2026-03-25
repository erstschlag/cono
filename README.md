# Backend
Spring boot based project featuring services organized as follows:
X.
- client (websocket/rest controllers)
- events (service specific event definitions)
- repository (repository and entities)
XService.java (service implementation)
XServiceDto.java (service specific dtos)
MapStructMapper.java (mapping entities to dtos)
...other X service related components/configurations/utilities

# Frontend
Javascript, jQuery, CSS and HTML based widgets can be found in the static resources.
General structure as follows:
X.
- x.html (widget)
- x.js (script loaded by x.html)
- x.css (stylesheet used by x.html)
- xCP.html (control panel for the widget)
- xCP.js (script loaded by xCP.html)
- xStorage.js (storage definition for widget data/config stored in the back-end)
... other x widget related resources

Most communication (events) between back- and front-end happens though WS (STOMP)
Check goal.js (in /resources/static/goal) for an example on how to connect to the back-end, send/receive events and deal with storage updates.


