/* 
 * Copyright 2020, Emanuel Rabina (http://www.ultraq.net.nz/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {STANDARD_CONFIGURATION} from '../source/Configurations.js';
import TemplateEngine           from '../source/TemplateEngine.js';

const template = `
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
	<div id="website">
		<div th:replace="~{footer :: copy}"></div>
		<div th:include="~{footer :: copy}"></div>
		<div th:insert="~{footer :: copy}"></div>
	</div>
</body>
</html>
`;

const fragment = `
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
	<div th:fragment="copy">
		(C) 2011 The Good Thymes Virtual Grocery
	</div>
</body>
</html>
`;

const expected = `
<!DOCTYPE html>
<html>
<head></head>
<body>
	<div id="website">
		<div>
			(C) 2011 The Good Thymes Virtual Grocery
		</div>
		<div th:include="~{footer :: copy}"></div>
		<div>
			<div>
				(C) 2011 The Good Thymes Virtual Grocery
			</div>
		</div>
	</div>
</body>
</html>
`;

function removeWhitespace(string) {
	return string.replace(/([\t\n])/g, '');
}

test('th:replace test', async function() {
	let templateEngine = new TemplateEngine({
		...STANDARD_CONFIGURATION,
		templateResolver: () => fragment
	});

	let result = await templateEngine.process(template);
	expect(removeWhitespace(result)).toBe(removeWhitespace(expected));
});
