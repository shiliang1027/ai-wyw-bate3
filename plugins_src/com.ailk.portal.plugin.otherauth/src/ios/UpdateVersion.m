//
//  UpdateVersion.m
//  portal
//
//  Created by gz on 14-2-27.
//
//

#import "UpdateVersion.h"
#import "VERSIONCONSTANT.h"
#import "VersionInfoHelper.h"

@implementation UpdateVersion

/**
 获取版本信息
 **/
-(void)updateInfo:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    NSString *nsstrLocalVersion = [[NSBundle mainBundle]objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    NSString* resultStr = @"{}";
    
    resultStr = @"{\"update\":\"false\",\"version\":\"";
    resultStr = nil == nsstrLocalVersion? [resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:nsstrLocalVersion];
    resultStr = [resultStr stringByAppendingString:@"\",\"url\":\""];
    //  resultStr = nil == url?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:@""];
    resultStr = [resultStr stringByAppendingString:@"\",\"description\":\""];
    //  resultStr = nil == desc?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:desc];
    resultStr = [resultStr stringByAppendingString:@"\",\"versionName\":\""];
    resultStr = nil == nsstrLocalVersion?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:nsstrLocalVersion];
    resultStr = [resultStr stringByAppendingString:@"\",\"currentVersionName\":\""];
    resultStr = nil == nsstrLocalVersion?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:nsstrLocalVersion];
    resultStr = [resultStr stringByAppendingString:@"\"}"];
    
    
    //    {"update":"false","version":"0.0.1","url":"","description":"【重要版本更新，主要内容】|解决动环设备门限值BUG","versionName":"0.0.1","currentVersionName":"0.0.1"}
    
    NSLog(@"needUpdate: %@", resultStr);
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:resultStr];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

-(void)updateInfo2:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    NSString *nsstrLocalVersion = [[NSBundle mainBundle]objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
    NSString* versionurl = [VERSIONPATH stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSString* xml = [NSString stringWithContentsOfURL:[NSURL URLWithString:versionurl] encoding:NSUTF8StringEncoding error:nil];

    NSString* resultStr = @"{}";
    if(nil != xml)
    {
        NSLog(@"Scheme: %@", xml);

        /**
        VersionXmlParser *versionParser = [[VersionXmlParser alloc] init];
        [versionParser load:xml];
        [versionParser unload];**/
        VersionInfoHelper *versionParser = [[VersionInfoHelper alloc] init];
        [versionParser viewDidLoad:VERSIONPATH];
      //  [versionParser unload];


        NSString* version = [[versionParser version] objectAtIndex:0];
      //  NSString* desc = VERSIONDESC;
        NSString* desc =  [[versionParser description] objectAtIndex:0];;
        NSString* url = @"";
       // 更改版本设置，只显示当前版本
        NSString* versionName = [[versionParser versionname] objectAtIndex:0];
//        NSString* versionName = nsstrLocalVersion;
  //      version = nsstrLocalVersion;

        //desc = [@"检测到版本更新\n您需要下载吗?"  stringByAppendingString:desc];

        if (!([nsstrLocalVersion isEqualToString:version]))
        {
            resultStr = @"{\"update\":\"true\",\"version\":\"";
            resultStr = nil == version? [resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:version];

            resultStr = [resultStr stringByAppendingString:@"\",\"url\":\""];
            resultStr = nil == url?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:@""];
            resultStr = [resultStr stringByAppendingString:@"\",\"description\":\""];
            resultStr = nil == desc?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:desc];
            resultStr = [resultStr stringByAppendingString:@"\",\"versionName\":\""];
            resultStr = nil == versionName?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:versionName];
            resultStr = [resultStr stringByAppendingString:@"\",\"currentVersionName\":\""];
            resultStr = nil == nsstrLocalVersion?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:nsstrLocalVersion];
            resultStr = [resultStr stringByAppendingString:@"\"}"];
        }
        else
        {
            resultStr = @"{\"update\":\"false\",\"version\":\"";
            resultStr = nil == version? [resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:version];

            resultStr = [resultStr stringByAppendingString:@"\",\"url\":\""];
            resultStr = nil == url?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:@""];
            resultStr = [resultStr stringByAppendingString:@"\",\"description\":\""];
            resultStr = nil == desc?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:desc];
            resultStr = [resultStr stringByAppendingString:@"\",\"versionName\":\""];
            resultStr = nil == versionName?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:versionName];
            resultStr = [resultStr stringByAppendingString:@"\",\"currentVersionName\":\""];
            resultStr = nil == nsstrLocalVersion?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:nsstrLocalVersion];
            resultStr = [resultStr stringByAppendingString:@"\"}"];

        }
    }
    NSLog(@"needUpdate: %@", resultStr);
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:resultStr];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//-(void)updateInfo:(CDVInvokedUrlCommand *)command
//{
//    CDVPluginResult* pluginResult = nil;
//    NSString *nsstrLocalVersion = [[NSBundle mainBundle]objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
//    NSString* versionurl = [VERSIONPATH stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
//    NSString* xml = [NSString stringWithContentsOfURL:[NSURL URLWithString:versionurl] encoding:NSUTF8StringEncoding error:nil];
//    
//    NSString* resultStr = @"{}";
//    if(nil != xml)
//    {
//        NSLog(@"Scheme: %@", xml);
//    
//        /**
//        VersionXmlParser *versionParser = [[VersionXmlParser alloc] init];
//        [versionParser load:xml];
//        [versionParser unload];**/
//        VersionInfoHelper *versionParser = [[VersionInfoHelper alloc] init];
//        [versionParser viewDidLoad:VERSIONPATH];
//      //  [versionParser unload];
//        
//        
//        NSString* version = [[versionParser version] objectAtIndex:0];
//      //  NSString* desc = VERSIONDESC;
//        NSString* desc =  [[versionParser description] objectAtIndex:0];;
//        NSString* url = @"";
//       // 更改版本设置，只显示当前版本
//       // NSString* versionName = [[versionParser versionname] objectAtIndex:0];
//        NSString* versionName = nsstrLocalVersion;
//        version = nsstrLocalVersion;
//        
//        //desc = [@"检测到版本更新\n您需要下载吗?"  stringByAppendingString:desc];
//        
//        if (!([nsstrLocalVersion isEqualToString:version]))
//        {
//            resultStr = @"{\"update\":\"true\",\"version\":\"";
//            resultStr = nil == version? [resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:version];
//            
//            resultStr = [resultStr stringByAppendingString:@"\",\"url\":\""];
//            resultStr = nil == url?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:@""];
//            resultStr = [resultStr stringByAppendingString:@"\",\"description\":\""];
//            resultStr = nil == desc?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:desc];
//            resultStr = [resultStr stringByAppendingString:@"\",\"versionName\":\""];
//            resultStr = nil == versionName?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:versionName];
//            resultStr = [resultStr stringByAppendingString:@"\",\"currentVersionName\":\""];
//            resultStr = nil == nsstrLocalVersion?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:nsstrLocalVersion];
//            resultStr = [resultStr stringByAppendingString:@"\"}"];
//        }
//        else
//        {
//            resultStr = @"{\"update\":\"false\",\"version\":\"";
//            resultStr = nil == version? [resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:version];
//            
//            resultStr = [resultStr stringByAppendingString:@"\",\"url\":\""];
//            resultStr = nil == url?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:@""];
//            resultStr = [resultStr stringByAppendingString:@"\",\"description\":\""];
//            resultStr = nil == desc?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:desc];
//            resultStr = [resultStr stringByAppendingString:@"\",\"versionName\":\""];
//            resultStr = nil == versionName?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:versionName];
//            resultStr = [resultStr stringByAppendingString:@"\",\"currentVersionName\":\""];
//            resultStr = nil == nsstrLocalVersion?[resultStr stringByAppendingString:@""]:[resultStr stringByAppendingString:nsstrLocalVersion];
//            resultStr = [resultStr stringByAppendingString:@"\"}"];
//
//        }
//    }
//    NSLog(@"needUpdate: %@", resultStr);
//    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:resultStr];
//    
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//}

- (void) update:(CDVInvokedUrlCommand*)command
{
    NSLog(@"begin update new version %@",@"" );
    CDVPluginResult* pluginResult;
        //下载
   // [[UIApplication sharedApplication] openURL:[NSURL URLWithString:DIRECTUPDATEPATH]];
    
//    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示" message:@"请通过APP store更新" delegate:self cancelButtonTitle:@"OK",nil];
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"YES"];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

@end
