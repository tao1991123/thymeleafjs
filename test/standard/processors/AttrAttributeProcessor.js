/* 
 * Copyright 2017, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import ExpressionProcessor         from '../../../source/standard/expressions/ExpressionProcessor.js';
import ThymeleafExpressionLanguage from '../../../source/standard/expressions/ThymeleafExpressionLanguage.js';
import AttrAttributeProcessor      from '../../../source/standard/processors/AttrAttributeProcessor.js';
import {createHtml}                from '../../../source/utilities/Dom.js';

/**
 * Tests for the `th:attr` attribute processor.
 */
describe('processors/standard/AttrAttributeProcessor', function() {

	let processor;
	let attribute;
	beforeAll(function() {
		processor = new AttrAttributeProcessor('test', new ExpressionProcessor(ThymeleafExpressionLanguage));
		attribute = `${processor.prefix}:${processor.name}`;
	});

	test('Set the value of the target attribute', function() {
		let value = 'test-class';
		let attributeValue = 'class=${value}';
		let element = createHtml(`<div ${attribute}="${attributeValue}"></div>`);
		processor.process(element, attribute, attributeValue, { value });
		expect(element.classList.contains(value)).toBe(true);
	});

	test('Set multiple attributes', function() {
		let valueId = 'test-id';
		let valueClass = 'test-class';
		let attributeValue = `id=\${valueId},class='${valueClass}'`;
		let element = createHtml(`<div ${attribute}="${attributeValue}"></div>`);
		processor.process(element, attribute, attributeValue, { valueId });
		expect(element.id).toBe(valueId);
		expect(element.classList.contains(valueClass)).toBe(true);
	});

	test("Do nothing if an expression doesn't match the attribute expression pattern", function() {
		['class=', '${nothing}'].forEach(attributeValue => {
			let element = createHtml(`<div ${attribute}="${attributeValue}"></div>`);
			processor.process(element, attribute, attributeValue);
			expect(element.attributes).toHaveLength(0);
		});
	});
});
