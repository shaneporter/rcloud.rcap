<table>
  <thead>
    <tr>
      <td>Variable</td>
      <td>Selection method</td>
      <td>Values</td>
    </tr>
  </thead>
  <tbody>
    <% _.each(profileDataItems, function(o, i){ %>
      <tr data-variablename="<%=o.name%>" data-id="<%=o.id%>">
        <td><%=o.description%></td>
        <td class="selection-method">
          <select id="<%=o.id%>">
            <option value="all">All values</option>
            <option value="selected"<%= _.findWhere(o.options, { selected: true }).length !== 0 ? ' selected="selected"' : ''%>>Selection</option>
          </select>
        </td>
        <td class="values">
          <div data-selectionmethod="all" <%= _.findWhere(o.options, { selected: true }).length !== 0 ? ' style="display:none"' : ''%>">All</div>
          <div data-selectionmethod="selected">
            <select data-parsley-variablevalidator="#<%=o.id%>" required multiple="multiple"<%= _.findWhere(o.options, { selected: true }).length === 0 ? ' style="display:none"' : ''%>>
              <% _.each(o.options, function(option, i) { %>
                <option value="<%=option.value%>" <%= option.selected ? ' selected="selected"' : ''%>><%=option.value%></option>
              <% }); %>
            </select>
          </div>
        </td>
      </tr>
    <% }); %>
  </tbody>
</table>
