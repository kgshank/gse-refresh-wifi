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

function _scanCompleted() {
    let accessPoints = this._device.get_access_points() || [ ];
    accessPoints.forEach(Lang.bind(this, function(ap) {
	                  this._accessPointAdded(this._device, ap);
	                }));
    this._activeApChanged();
    this._updateSensitivity();
    this._syncView();
}

function _buildLayoutLocal() {
    this._buildLayoutSuper();
    let refreshButton = new St.Button({ reactive: true,
                                       can_focus: true,
                                       track_hover: true,
                                       accessible_name: _("Refresh Connections"),
                                       style_class: 'system-menu-action' });
    refreshButton.add_style_class_name('refresh-wifi-button');
    refreshButton.child = new St.Icon({ icon_name: 'view-refresh-symbolic', style_class: 'nm-dialog-icon' });
    refreshButton.connect('clicked', Lang.bind(this, function(){
                    let accessPoints = this._device.get_access_points() || [ ];
                    accessPoints.forEach(Lang.bind(this, function(ap) {
                    	this._accessPointRemoved(this._device, ap);
                    }));
                    this._device.request_scan_simple(Lang.bind(this,this._scanCompleted));                 
                }));
    this.contentLayout.first_child.add(refreshButton ,{ expand: true,
                                                       x_fill: false,
                                                       x_align: St.Align.END });
}

function enable() {
    if(!WirelessDialog.prototype._buildLayoutSuper) {
        WirelessDialog.prototype._buildLayoutSuper = WirelessDialog.prototype._buildLayout;
        WirelessDialog.prototype._buildLayout = _buildLayoutLocal;
        WirelessDialog.prototype._scanCompleted = _scanCompleted
    }
}

function disable() {
    if(WirelessDialog.prototype._buildLayoutSuper) {
        WirelessDialog.prototype._buildLayout = WirelessDialog.prototype._buildLayoutSuper;
        delete WirelessDialog.prototype['_buildLayoutSuper'];
        delete WirelessDialog.prototype['_scanCompleted'];
    }    
}

