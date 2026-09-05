-- {{< rings lit=2 >}}                      the concentric-rings graphic, rings 1–2 lit, ring 3 dimmed
-- {{< rings lit=1 size=260 >}}             a larger one (size in slide px; default 130)
-- {{< rings lit=3 class="rings--crumb" >}} top-right of a layer slide, on the title line (the breadcrumb)
-- {{< rings lit=1 label="Layer 1 of 3" >}} accessible name (default "Layer N of 3")
--
-- Emits <svg class="rings" data-lit="N"> with one <use> per ring, so assets/rings.css can colour
-- each ring and dim the ones above the lit level. The symbols themselves live in
-- assets/rings-symbols.html (include-after-body).
local function str(v, default)
  if v == nil then return default end
  local s = pandoc.utils.stringify(v)
  if s == '' then return default end
  return s
end

return {
  ['rings'] = function(args, kwargs, meta, raw_args, context)
    local lit = tonumber(str(kwargs['lit'], '3')) or 3
    if lit < 0 then lit = 0 elseif lit > 3 then lit = 3 end
    local size = str(kwargs['size'], '130')
    local class = str(kwargs['class'], '')
    local label = str(kwargs['label'], 'Layer ' .. lit .. ' of 3')
    local html = string.format(
      '<svg class="rings %s" data-lit="%d" viewBox="0 0 600 600" width="%s" height="%s" role="img" aria-label="%s">' ..
      '<use href="#rings-l3" class="ring ring-3"/>' ..
      '<use href="#rings-l2" class="ring ring-2"/>' ..
      '<use href="#rings-l1" class="ring ring-1"/>' ..
      '</svg>',
      class, lit, size, size, label)
    if context == 'block' then
      return pandoc.RawBlock('html', html)
    end
    return pandoc.RawInline('html', html)
  end
}
