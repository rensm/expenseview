set compiledJS=..\cjs\DefaultJS_v1.4.js
set gadgetModulesJS=..\cjs\GadgetModules_v1.4.js

del %compiledJS%
del %gadgetModulesJS%

type JsonServiceProxy.js | jazmin >> %compiledJS%

type controller\AddTransController.js | jazmin >> %compiledJS%
type controller\CategoryController.js | jazmin >> %compiledJS%
type controller\EditRecentTransController.js | jazmin >> %compiledJS%
type controller\TabPanelController.js | jazmin >> %compiledJS%
type controller\TransController.js | jazmin >> %compiledJS%

type data\CategoryData.js | jazmin >> %compiledJS%

type lib\Json.js | jazmin >> %compiledJS%

type modules\AddCategoryModule.js | jazmin >> %compiledJS%
type modules\AddTransModule.js | jazmin >> %compiledJS%
type modules\BalanceChangeTableModule.js | jazmin >> %compiledJS%
type modules\CalendarModule.js | jazmin >> %compiledJS%
type modules\CategoryTableModule.js | jazmin >> %compiledJS%
type modules\ExpectedBalanceTableModule.js | jazmin >> %compiledJS%
type modules\PieGraphModule.js | jazmin >> %compiledJS%
type modules\SearchTransModule.js | jazmin >> %compiledJS%
type modules\TransSummaryTableModule.js | jazmin >> %compiledJS%
type modules\TransTableModule.js | jazmin >> %compiledJS%
type modules\SubCategoryModule.js | jazmin >> %compiledJS%

type pages\AjaxPage.js | jazmin >> %compiledJS%
type pages\ExpensePage.js | jazmin >> %compiledJS%
type pages\IncomePage.js | jazmin >> %compiledJS%
type pages\BalancePage.js | jazmin >> %compiledJS%

type utilities\FieldFunctions.js | jazmin >> %compiledJS%
type utilities\FormatFunctions.js | jazmin >> %compiledJS%
type utilities\StringBuffer.js | jazmin >> %compiledJS%
type utilities\Tooltip.js | jazmin >> %compiledJS%
type utilities\ValidationFunctions.js | jazmin  >> %compiledJS%

type GadgetModules.js | jazmin >> %gadgetModulesJS%
type modules\CalendarModule.js | jazmin >> %gadgetModulesJS%
type data\CategoryData.js | jazmin >> %gadgetModulesJS%
type controller\CategoryController.js | jazmin >> %gadgetModulesJS%
type utilities\FormatFunctions.js | jazmin >> %gadgetModulesJS%
type utilities\Json.js | jazmin >> %gadgetModulesJS%
type utilities\FieldFunctions.js | jazmin >> %gadgetModulesJS%
type utilities\ValidationFunctions.js | jazmin  >> %gadgetModulesJS%
type utilities\StringBuffer.js | jazmin >> %gadgetModulesJS%
