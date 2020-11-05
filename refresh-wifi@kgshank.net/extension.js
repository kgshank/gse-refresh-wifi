/*******************************************************************************
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 * *****************************************************************************
 * Original Author: Gopi Sankar Karmegam
 ******************************************************************************/
// const Lang = imports.lang;
const { Clutter, St } = imports.gi;
       
const WirelessDialog = imports.ui.status.network.NMWirelessDialog

function init() {
}

function _buildLayoutLocal() {
    this._buildLayoutSuper();
    let refreshButton = new St.Button({
        reactive : true,
        can_focus : true,
        track_hover : true,
        accessible_name : _("Refresh Connections"),
        style_class : 'modal-dialog-button button',
        style : "border-radius: 32px; border: 2px",
        // style_class : 'bubble-button button',
        label : "Refresh Wifi",
        x_expand : true, 
        y_expand : true,
       // x_fill : true, 
       // y_fill : true,
        x_align : Clutter.ActorAlign.END
         
    });

    refreshButton.child = new St.Icon({
        icon_name : 'view-refresh-symbolic',
        style_class : 'nm-dialog-icon'
    });

    
// refreshButton.connect('clicked', function() { log("Button
// clicked");}.bind(this));
    
    refreshButton.connect('clicked', this._onScanTimeout.bind(this));

    this.contentLayout.first_child.add_actor(refreshButton);
}

function enable() {
    if (!WirelessDialog.prototype._buildLayoutSuper) {
        WirelessDialog.prototype._buildLayoutSuper = WirelessDialog.prototype._buildLayout;
        WirelessDialog.prototype._buildLayout = _buildLayoutLocal;
    }
}

function disable() {
    if (WirelessDialog.prototype._buildLayoutSuper) {
        WirelessDialog.prototype._buildLayout = WirelessDialog.prototype._buildLayoutSuper;
        delete WirelessDialog.prototype['_buildLayoutSuper'];
    }
}
