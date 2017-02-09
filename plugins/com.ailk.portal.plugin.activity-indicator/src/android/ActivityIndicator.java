package com.ailk.portal.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.ProgressDialog;

public class ActivityIndicator extends CordovaPlugin {
	private ProgressDialog activityIndicator = null;

	@Override
	public boolean execute(String action, JSONArray args,
			final CallbackContext callbackContext) throws JSONException {
		if (action.equals("show")) {
			String text = args.getString(0);
			show(text);
			callbackContext.success();
			return true;
		} else if (action.equals("hide")) {
			hide();
			callbackContext.success();
			return true;
		}
		return false;
	}

	/**
	 * This show the ProgressDialog
	 * @param text - Message to display in the Progress Dialog
	 */
	public void show(String text) {
		if(activityIndicator == null || activityIndicator.isShowing() == false){
			activityIndicator = ProgressDialog.show(this.cordova.getActivity(), "", text);
		}
	}

	/**
	 * This hide the ProgressDialog
	 */
	public void hide() {
		if (activityIndicator != null && activityIndicator.isShowing() == true) {
			activityIndicator.dismiss();
			activityIndicator = null;
		}
	}
}
