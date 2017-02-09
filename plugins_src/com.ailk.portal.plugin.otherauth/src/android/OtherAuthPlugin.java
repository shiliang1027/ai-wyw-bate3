package com.ailk.portal.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;

import com.ailk.portal.common.CommonConstants;
import com.ultrapower.auth.AuthWbLoginActivity;

import android.content.Intent;

public class OtherAuthPlugin extends CordovaPlugin {

	
	CallbackContext call = null;
	
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) {
		try {
			call = callbackContext;
			if("otherAuth".equalsIgnoreCase(action)) {
				/**
				* 启动统一认证平台页面
				*	其中requestCode参数为用户自由指定的整型请求码
				*	其中state为client端的状态值。client端的状态值。用于第三方应用防止CSRF攻击，成功授权后回调时会原样带回。请务必严格按照流程检查用户与state参数状态的绑定。
				*	其中scope为授权范围。例如：scope=get_basicUserInfo   不传则默认请求对接口get_basicUserInfo进行授权
				*/
				Intent intent = new Intent(cordova.getActivity(),AuthWbLoginActivity.class);
				intent.putExtra(AuthWbLoginActivity.STATE,"111111222333");
//				intent.putExtra(AuthWbLoginActivity.SCOPE,String scope);
				cordova.startActivityForResult(this,intent,0);
				
				return true;
			}
		}
		catch(Exception e) {
			LOG.e(CommonConstants.PROJECTNAME, action+"操作失败，原因：", e);
		}
		
		return false;
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		super.onActivityResult(requestCode, resultCode, intent);
		PluginResult mPlugin = new PluginResult(PluginResult.Status.OK);  
        mPlugin.setKeepCallback(true); 
        call.sendPluginResult(mPlugin);  
		if(resultCode==AuthWbLoginActivity.RESULT_CODE){
			String jsonData = intent.getStringExtra(AuthWbLoginActivity.RESULT_STR);
			call.success(jsonData);
			return ;
		}
		call.error("调用activity失败!");
		return ;

	}

}
