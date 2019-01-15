/*================================================================================================================================================
Copyright (c) 2008-2015 by BIMiner Technologies Inc, All rights reserved.
Description: For Invoice.aspx
Revisions: 20150904 James. IE9 & ResizeShell.
=================================================================================================================================================*/

var app = 16331;

function toolBar(e) {
    gm.editDo();
    postDataSet(gm);

    if (e == "Find")
        rm.find(380);
    else
        toolBarCommon(e);
}

function asynForm(txt) { pnBlur(txt); }

// ====== Select Part Number ==================================
var oldPN = "";

function pnFocus(obj) {
    oldPN = obj.value.trim();
}

function pnBlur(obj) {
    if (oldPN == obj.value.trim()) return;

    var es = new Object();          // EventShuttle     
    es.Event = "GetItemMasterC0";    // Event 
    es.Value = obj.value.trim();   // Value
    var qs = Sys.Serialization.JavaScriptSerializer.serialize(es);
    var url = "/BIMHandler.ashx?r=" + encodeURIComponent(qs);

    ashxInvoke(url, ashxHandler);
}

function resGetItemMasterC0(es) {
    if (es.Value == '') return;

    ii = Sys.Serialization.JavaScriptSerializer.deserialize(es.Value);
    if (ii.ComponentName) gm.setField('Component_Name', ii.ComponentName);
    if (ii.ItemDescription) gm.setField('Item_Description', ii.ItemDescription);
}

function gridFieldFocus(obj) { pnFocus(obj); }
function gridFieldBlur(obj) { pnBlur(obj); }
// ====== Add Line ==================================
function addLine() {
    if (checkNoData() == false) return;
    gm.editDo();
    postDataSet(gm);
    __doPostBack(clvlkbFake, "AddLine");
}

// ====== Delete Line ==================================
function deleteLine() {
    if (checkNoData() == false) return;
    gm.editDo();
    postDataSet(gm);
    __doPostBack(clvlkbFake, "DeleteLine");
}

// ====== Copy BOM ==================================
function copyBOM() {
    if (checkNoData() == false) return;
    gm.editDo();
    postDataSet(gm);
    __doPostBack(clvlkbFake, "CopyBOM");
}


function reCalculateLineNumber() {
    if (checkNoData() == false) return;
    gm.editDo();
    postDataSet(gm);
    __doPostBack(clvlkbFake, "ReCalculateLineNumber");
}

function pageUnload() {
    //        Sys.Debug.trace("pageUnload: BOM");
    gm.disposeEditRowControls();
}

/**
* Function: doResize
* Callback function called by {BIMiner.ResizerShell}
*/
function doResize() {
    resizeIFrame(window.frameElement);
    resizeTab($get(vf0));
    gm.adjustHeight();
}

function pageLoad() {
    rm = new BIMiner.FormManager();
    rm.initialize();

    var ha = -38;
    gm = $create(BIMiner.GridManager,
        { formType: "Tab", heightAdj: ha, widthAdj: -18,
            property: (BIMiner.GridProperty.AllowResize | BIMiner.GridProperty.AllowSelect | BIMiner.GridProperty.AllowEdit)
        }, null, null, $get("divTContainer"));

	rs = $create(BIMiner.ResizerShell, {}, null, null, null);
	window.onresize = function() { rs.resize(); }

    if (formShuttle.PreJSon.indexOf("AddLineSuccess:") >= 0) {
        var newID = formShuttle.PreJSon.replace("AddLineSuccess:", "");
        formShuttle.PreJSon = "";
        setFormShuttle();
        var row = gm.setRowCurrentByKey(newID);
        if (row) { gm.edit(row); }
    }
    rm.pageLoaded();
}