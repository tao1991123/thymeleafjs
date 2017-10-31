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

import StandardAttrAttributeProcessor  from '../../../src/standard/processors/StandardAttrAttributeProcessor';
import {createThymeleafAttributeValue} from '../../../src/utilities/Dom';

import {assert} from 'chai';
import h        from 'hyperscript';
import hh       from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the `th:attr` attribute processor.
 */
describe('processors/standard/StandardAttrAttributeProcessor', function() {

	let processor;
	let attribute;
	before(function() {
		processor = new StandardAttrAttributeProcessor('test');
		attribute = `${processor.name}:${processor.prefix}`;
	});

	it('Set the value of the target attribute', function() {
		let value = 'test-class';
		let attributeValue = 'class=${value}';
		let element = createThymeleafAttributeValue(div(), attribute, attributeValue);

		processor.process(element, attribute, attributeValue, { value });

		assert.isTrue(element.classList.contains(value));
	});

	it('Set multiple attributes', function() {
		let valueId = 'test-id';
		let valueClass = 'test-class';
		let attributeValue = `id=\${valueId},class=${valueClass}`;
		let element = createThymeleafAttributeValue(div(), attribute, attributeValue);

		processor.process(element, attribute, attributeValue, { valueId });

		assert.strictEqual(element.id, valueId);
		assert.isTrue(element.classList.contains(valueClass));
	});

	it("Do nothing if an expression doesn't match the attribute expression pattern", function() {
		['class=', '${nothing}'].forEach(attributeValue => {
			let element = createThymeleafAttributeValue(div(), attribute, attributeValue);

			processor.process(element, attribute, attributeValue);

			assert.isUndefined(div.attributes);
		});
	});
});