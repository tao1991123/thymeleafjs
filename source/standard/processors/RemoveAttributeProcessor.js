/* 
 * Copyright 2019, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import AttributeProcessor from '../../processors/AttributeProcessor.js';

/**
 * `th:remove`, used to remove the current element or select parts of it (and
 * its children).
 * 
 * @author Emanuel Rabina
 */
export default class RemoveAttributeProcessor extends AttributeProcessor {

	static NAME = 'remove';

	/**
	 * Constructor, set this processor to use the `remove` name and supplied
	 * prefix.
	 * 
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super(prefix, RemoveAttributeProcessor.NAME);
	}

	/**
	 * Processes an element that contains a `th:remove`/`data-th-remove`
	 * attribute, removing the current element or parts of it based on the
	 * attribute value.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {String} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {String} attributeValue
	 *   The value given by the attribute.
	 * @param {Object} context
	 * @return {Promise<Boolean>} Whether or not the parent element needs to do a
	 *   second pass as its children have been modified by this processor.
	 */
	async process(element, attribute, attributeValue, context) {

		element.removeAttribute(attribute);

		switch (attributeValue) {
			case 'all':
				element.parentElement.removeChild(element);
		}

		return false;
	}
}
