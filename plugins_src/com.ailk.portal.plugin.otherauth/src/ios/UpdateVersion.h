//
//  UpdateVersion.h
//  portal
//
//  Created by gz on 14-2-27.
//
//

#import <Cordova/CDV.h>

@interface UpdateVersion : CDVPlugin

// 获取版本号
-(void)getVersion:(CDVInvokedUrlCommand *)command;
// 获取从配置文件中读取到的版本信息
-(void)updateInfo:(CDVInvokedUrlCommand *)command;
// 更新新版本
-(void)update:(CDVInvokedUrlCommand *)command;
@end
