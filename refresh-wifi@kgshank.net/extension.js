/******************************************************************************
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Orignal Author: Gopi Sankar Karmegam
******************************************************************************/
const Lang = imports.lang;
const St = imports.gi.St;
const WirelessDialog = imports.ui.status.network.NMWirelessDialog

function init() {
}

function scanCompleted() {
    let accessPoints = _this._device.get_access_points() || [ ];
    accessPoints.forEach(Lang.bind(_this, function(ap) {
	                  _this._accessPointAdded(_this._device, ap);
	                }));
    _this._activeApChanged();
    _this._updateSensitivity();
    _this._syncView();
}

var _this;
function _buildLayoutLocal() {
    this._buildLayoutSuper();
    _this = this;
    let refreshButton = new St.Button({ reactive: true,
                                       can_focus: true,
                                       track_hover: true,
                                       accessible_name: _("Refresh Connections"),
                                       style_class: 'system-menu-action' });
    refreshButton.child = new St.Icon({ icon_name: "view-refresh-symbolic" });
    refreshButton.connect('clicked', function(){
                    let accessPoints = _this._device.get_access_points() || [ ];
                    accessPoints.forEach(Lang.bind(_this, function(ap) {
                        _this._accessPointRemoved(_this._device, ap);
                    }));
                    _this._device.request_scan_simple(scanCompleted);                 
                });
    this.contentLayout.first_child.add(refreshButton ,{ expand: true,
                                                       x_fill: false,
                                                       x_align: St.Align.END });
}

function enable() {
    if(!WirelessDialog.prototype._buildLayoutSuper) {
        WirelessDialog.prototype._buildLayoutSuper = WirelessDialog.prototype._buildLayout;
        WirelessDialog.prototype._buildLayout = _buildLayoutLocal;
    }
}

function disable() {
    if(WirelessDialog.prototype._buildLayoutSuper) {
        WirelessDialog.prototype._buildLayout = WirelessDialog.prototype._buildLayoutSuper;
        delete WirelessDialog.prototype['_buildLayoutSuper'];
    }
    if(_this) {
        _this = null;
    }    
}

