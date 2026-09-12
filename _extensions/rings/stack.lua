-- {{< stack highlight=app >}}                    the three-layer stack (app on top), app full colour, the rest dimmed
-- {{< stack highlight=app fragments=true >}}     built bottom-up by fragments: template (0), package (1), app (2)
-- {{< stack highlight=all arrows=up >}}          Lessons callback: everything lit, connectors point app → package → template
-- {{< stack highlight=package index=2 >}}        fragments starting at data-fragment-index 2
--
-- Emits <div class="stack" data-highlight="…" data-arrows="down|up"> with three .stack__row bars
-- (each a .card in its layer's colour) and a connector between them. Styles: theme/brand.scss.
local function str(v, default)
  if v == nil then return default end
  local s = pandoc.utils.stringify(v)
  if s == '' then return default end
  return s
end

local BARS = {
  { key = 'app',      level = 3, label = 'Dirt Data Reports', kind = 'Shiny App', desc = 'Upload data, configure reports, render. No R.' },
  { key = 'package',  level = 2, label = '{soils}',           kind = 'R Package', desc = 'Functions for validation, processing, and visualization.' },
  { key = 'template', level = 1, label = 'Parameterized Quarto', kind = 'Template', desc = 'Dynamically define report content for each farmer.' },
}

return {
  ['stack'] = function(args, kwargs, meta, raw_args, context)
    local highlight = str(kwargs['highlight'], 'app')
    local arrows    = str(kwargs['arrows'], 'down')
    local fragments = str(kwargs['fragments'], 'false') == 'true'
    local index0    = tonumber(str(kwargs['index'], '0')) or 0
    local class     = str(kwargs['class'], '')
    local parts = {}
    table.insert(parts, string.format('<div class="stack %s" data-highlight="%s" data-arrows="%s">', class, highlight, arrows))
    local n = #BARS
    for i, b in ipairs(BARS) do
      -- fragments build bottom-up: the last bar in DOM order (template) is index 0
      local frag = ''
      if fragments then frag = string.format(' fragment" data-fragment-index="%d', index0 + (n - i)) end
      local kind = ''
      if b.kind ~= '' then kind = string.format('<span class="stack__kind">%s</span>', b.kind) end
      table.insert(parts, string.format(
        '<div class="stack__row stack__row--%s%s">' ..
        '<div class="card card--l%d stack__bar"><div class="stack__head"><code class="stack__label">%s</code>%s</div><p class="stack__desc">%s</p></div>' ..
        '</div>',
        b.key, frag, b.level, b.label, kind, b.desc))
      if i < n then
        -- the connector belongs to the bar above it (it appears with that bar)
        local cfrag = ''
        if fragments then cfrag = string.format(' fragment" data-fragment-index="%d', index0 + (n - i)) end
        table.insert(parts, string.format(
          '<div class="stack__link%s" aria-hidden="true"><svg viewBox="0 0 24 40"><path d="M12 3v28"/><path d="M4 24l8 10 8-10"/></svg></div>', cfrag))
      end
    end
    table.insert(parts, '</div>')
    local html = table.concat(parts, '\n')
    if context == 'block' then return pandoc.RawBlock('html', html) end
    return pandoc.RawInline('html', html)
  end
}
