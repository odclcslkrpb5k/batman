// assumes winbox.js and tui-grid.js have been loaded already

const COLORS = {
  system: "#fecb00",
};

const WINDOWS = {};

WINDOWS.thing_types = () => {

  const grid_div = document.createElement("div");
  grid_div.id = "thing_types_grid";
  grid_div.style.width = "100%";

  new WinBox("Thing Types", {
    background: COLORS.system,
    mount: grid_div,
  });

  const grid = new tui.Grid({
    el: grid_div,
    data: {
      api: {
        readData: { url: '/thing_type', method: 'GET' }
      }
    },
    columns: [
      { header: 'Key', name: 'key', width: 20 },
      { header: "Name", name: "name", width: 100, },
      { header: "Description", name: "description", minWidth: 200 },
      { header: "Max Contents", name: "max_contents" },
      { header: "Max Locations", name: "max_locations" },
      { header: "Parent Type", name: "parent_type_name" },
    ],
  });

};
