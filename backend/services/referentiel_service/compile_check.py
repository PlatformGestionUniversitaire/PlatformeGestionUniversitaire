import py_compile
from pathlib import Path

errors = False
for p in Path('.').rglob('*.py'):
    try:
        py_compile.compile(p, doraise=True)
    except py_compile.PyCompileError as e:
        print('COMPILE ERROR in', p)
        print(e)
        errors = True

if not errors:
    print('All files compiled successfully')
