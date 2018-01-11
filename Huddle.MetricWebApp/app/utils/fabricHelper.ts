declare var fabric: any;
declare var jQuery: any;

export class FabricHelper{

    public static init() {
        this.initFabricList();
        this.initFabricDropdown();
        this.initFabricButton();
        this.initTable();
        this.initToggle();
        this.initSpinner();
    }

    public static initFabricList() {
        var ListElements = document.querySelectorAll(".ms-List");
        for (var i = 0; i < ListElements.length; i++) {
            new fabric['List'](ListElements[i]);
        }

    }

    public static initFabricDropdown() {
        var DropdownHTMLElements = document.querySelectorAll('.ms-Dropdown');
        for (var i = 0; i < DropdownHTMLElements.length; ++i) {
            var $root = jQuery(DropdownHTMLElements[i]);
            var $select = $root.find("select");
            if ($select.length == 0)
                continue;
            var $msDropSelect = $select.parent().find("ul");
            if ($msDropSelect.children().length > 0)
                continue;
            $msDropSelect.prev().remove();
            $msDropSelect.remove();
            var Dropdown = new fabric['Dropdown'](DropdownHTMLElements[i]);
            var selectedDropdown = $root.find(".ms-Dropdown-item").first();
            selectedDropdown.addClass("is-selected");
            if (!$root.hasClass('no-default')) {
                $root.find(".ms-Dropdown-title").html(selectedDropdown.html());
            }
            jQuery.each($select[0].attributes, function () {
                if (this.name.indexOf("_ngcontent-") === 0) {
                    $select.nextAll().attr(this.name, this.value);
                }
            });
        }
    }

    public static reInitFabricDropdown() {
        var DropdownHTMLElements = document.querySelectorAll('.ms-Dropdown');
        for (var i = 0; i < DropdownHTMLElements.length; ++i) {
            var $root = jQuery(DropdownHTMLElements[i]);
            var selectedDropdown = $root.find(".ms-Dropdown-item").not('.is-selected').first();
            if (!$root.hasClass('no-default'))
                $root.find(".ms-Dropdown-title").html(selectedDropdown.html());
        }
    }

    public static  initFabricButton() {
        var ButtonElements = document.querySelectorAll(".ms-Button");
        for (var i = 0; i < ButtonElements.length; i++) {
            new fabric['Button'](ButtonElements[i]);
        }
    }

    public static  initTable() {
        var TableElements = document.querySelectorAll(".ms-Table");
        for (var i = 0; i < TableElements.length; i++) {
            new fabric['Table'](TableElements[i]);
        }
    }

    public static  initToggle() {
        var ToggleElements = document.querySelectorAll(".ms-Toggle");
        for (var i = 0; i < ToggleElements.length; i++) {
            let toggleAdded = "toggle-fabric";
            let jqueryElement = jQuery(ToggleElements[i]);
            if (!jqueryElement.hasClass(toggleAdded)){
                jqueryElement.addClass(toggleAdded);
                new fabric['Toggle'](ToggleElements[i]);
            }
            
        }
    }

    public static initSpinner() {
        var SpinnerElements = document.querySelectorAll(".ms-Spinner");
        for (var i = 0; i < SpinnerElements.length; i++) {
          new fabric['Spinner'](SpinnerElements[i]);
        }
    }

}