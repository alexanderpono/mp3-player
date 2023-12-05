var shell = new ActiveXObject("Shell.Application");
var args = WScript.Arguments;
if (args.length == 0) {
    WSH.Echo('Please specify drive letter. Example: e:');
    WSH.Quit;
}
var driveLetter = args.Item(0);
WSH.Echo('trying to eject', driveLetter);
shell.NameSpace(17).ParseName(driveLetter).InvokeVerb("Eject");
WSH.Sleep(2000);
