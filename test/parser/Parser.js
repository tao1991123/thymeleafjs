/* 
 * Copyright 2018, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import Grammar          from '../../src/parser/Grammar';
import Parser           from '../../src/parser/Parser';
import Rule             from '../../src/parser/Rule';
import SimpleExpression from '../../src/parser/SimpleExpression';

/**
 * Tests for the main parser component.
 */
describe('parser/Parser', function() {

	let parser;
	beforeEach(function() {
		parser = new Parser(
			new Grammar('Test',
				new Rule('StartingRule', new SimpleExpression(/abc/))
			)
		);
	});

	test('Parsing successful when configured grammar returns nodes for all read input', function() {
		let result = parser.parse('abc');
		expect(result).toBe('abc');
	});

	test('Parsing fails if not all input was read', function() {
		expect(() => {
			parser.parse('abcd');
		}).toThrow();
	});
});